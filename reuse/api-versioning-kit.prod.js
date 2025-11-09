"use strict";
/**
 * LOC: API_VER_PROD_001
 * File: /reuse/api-versioning-kit.prod.ts
 *
 * UPSTREAM (imports from):
 *   - @nestjs/common
 *   - @nestjs/swagger
 *   - sequelize-typescript
 *   - zod
 *   - express
 *
 * DOWNSTREAM (imported by):
 *   - API controllers requiring versioning
 *   - Version migration services
 *   - API gateway/routing
 *   - Deprecation management services
 *   - Analytics services
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
exports.VersionController = exports.VersionService = exports.DeprecationInterceptor = exports.VersionGuard = exports.CurrentVersion = exports.RequiresVersion = exports.SunsetDate = exports.DeprecatedEndpoint = exports.ApiVersion = exports.SUNSET_DATE_KEY = exports.DEPRECATED_KEY = exports.API_VERSION_KEY = exports.VersionAnalyticsModel = exports.VersionMigrationModel = exports.DeprecationScheduleModel = exports.APIEndpointVersionModel = exports.APIVersionModel = exports.BackwardCompatibilityConfigSchema = exports.MigrationGuideSchema = exports.BreakingChangeSchema = exports.DeprecationPolicySchema = exports.APIVersionSchema = exports.VersionComparison = exports.BreakingChangeType = exports.DeprecationLevel = exports.VersionStatus = exports.VersionStrategy = void 0;
exports.parseVersionFromUri = parseVersionFromUri;
exports.validateVersionUri = validateVersionUri;
exports.extractVersionPrefix = extractVersionPrefix;
exports.createVersionedPath = createVersionedPath;
exports.normalizeVersionUri = normalizeVersionUri;
exports.isValidVersionFormat = isValidVersionFormat;
exports.parseVersionFromHeader = parseVersionFromHeader;
exports.createVersionHeader = createVersionHeader;
exports.negotiateVersion = negotiateVersion;
exports.validateVersionHeader = validateVersionHeader;
exports.extractCustomHeader = extractCustomHeader;
exports.createAcceptVersionHeader = createAcceptVersionHeader;
exports.parseVersionFromAcceptHeader = parseVersionFromAcceptHeader;
exports.selectVersionByContent = selectVersionByContent;
exports.createContentTypeVersion = createContentTypeVersion;
exports.matchMediaType = matchMediaType;
exports.prioritizeVersions = prioritizeVersions;
exports.createDeprecationWarning = createDeprecationWarning;
exports.checkDeprecationStatus = checkDeprecationStatus;
exports.calculateSunsetDate = calculateSunsetDate;
exports.generateSunsetHeader = generateSunsetHeader;
exports.scheduleDeprecation = scheduleDeprecation;
exports.notifyDeprecation = notifyDeprecation;
exports.isVersionDeprecated = isVersionDeprecated;
exports.getRemainingLifetime = getRemainingLifetime;
exports.generateMigrationGuide = generateMigrationGuide;
exports.detectBreakingChanges = detectBreakingChanges;
exports.createCompatibilityLayer = createCompatibilityLayer;
exports.transformRequestToVersion = transformRequestToVersion;
exports.transformResponseFromVersion = transformResponseFromVersion;
exports.validateBackwardCompatibility = validateBackwardCompatibility;
exports.generateChangeLog = generateChangeLog;
exports.trackVersionUsage = trackVersionUsage;
exports.getVersionMetrics = getVersionMetrics;
exports.analyzeVersionAdoption = analyzeVersionAdoption;
exports.calculateMigrationRate = calculateMigrationRate;
exports.getVersionDistribution = getVersionDistribution;
exports.generateVersionReport = generateVersionReport;
exports.routeToVersion = routeToVersion;
exports.createVersionMiddleware = createVersionMiddleware;
exports.registerVersionedRoute = registerVersionedRoute;
exports.getVersionHandler = getVersionHandler;
exports.resolveVersionConflict = resolveVersionConflict;
exports.createVersionRouter = createVersionRouter;
exports.validateVersionAccess = validateVersionAccess;
exports.applyVersionPolicy = applyVersionPolicy;
exports.compareVersions = compareVersions;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const operators_1 = require("rxjs/operators");
const zod_1 = require("zod");
const sequelize_typescript_1 = require("sequelize-typescript");
// ============================================================================
// TYPE DEFINITIONS
// ============================================================================
/**
 * API versioning strategy types
 */
var VersionStrategy;
(function (VersionStrategy) {
    VersionStrategy["URI"] = "uri";
    VersionStrategy["HEADER"] = "header";
    VersionStrategy["ACCEPT_HEADER"] = "accept_header";
    VersionStrategy["QUERY_PARAM"] = "query_param";
    VersionStrategy["CUSTOM"] = "custom";
})(VersionStrategy || (exports.VersionStrategy = VersionStrategy = {}));
/**
 * API version lifecycle status
 */
var VersionStatus;
(function (VersionStatus) {
    VersionStatus["DEVELOPMENT"] = "development";
    VersionStatus["BETA"] = "beta";
    VersionStatus["ACTIVE"] = "active";
    VersionStatus["DEPRECATED"] = "deprecated";
    VersionStatus["SUNSET"] = "sunset";
    VersionStatus["RETIRED"] = "retired";
})(VersionStatus || (exports.VersionStatus = VersionStatus = {}));
/**
 * Deprecation warning levels
 */
var DeprecationLevel;
(function (DeprecationLevel) {
    DeprecationLevel["INFO"] = "info";
    DeprecationLevel["WARNING"] = "warning";
    DeprecationLevel["CRITICAL"] = "critical";
    DeprecationLevel["RETIRED"] = "retired";
})(DeprecationLevel || (exports.DeprecationLevel = DeprecationLevel = {}));
/**
 * Breaking change types
 */
var BreakingChangeType;
(function (BreakingChangeType) {
    BreakingChangeType["FIELD_REMOVED"] = "field_removed";
    BreakingChangeType["FIELD_RENAMED"] = "field_renamed";
    BreakingChangeType["TYPE_CHANGED"] = "type_changed";
    BreakingChangeType["ENDPOINT_REMOVED"] = "endpoint_removed";
    BreakingChangeType["ENDPOINT_MOVED"] = "endpoint_moved";
    BreakingChangeType["AUTH_CHANGED"] = "auth_changed";
    BreakingChangeType["BEHAVIOR_CHANGED"] = "behavior_changed";
    BreakingChangeType["VALIDATION_CHANGED"] = "validation_changed";
})(BreakingChangeType || (exports.BreakingChangeType = BreakingChangeType = {}));
/**
 * Version comparison result
 */
var VersionComparison;
(function (VersionComparison) {
    VersionComparison[VersionComparison["GREATER"] = 1] = "GREATER";
    VersionComparison[VersionComparison["EQUAL"] = 0] = "EQUAL";
    VersionComparison[VersionComparison["LESS"] = -1] = "LESS";
    VersionComparison[VersionComparison["INCOMPATIBLE"] = -2] = "INCOMPATIBLE";
})(VersionComparison || (exports.VersionComparison = VersionComparison = {}));
// ============================================================================
// ZOD VALIDATION SCHEMAS
// ============================================================================
/**
 * Semantic version regex pattern
 */
const SEMVER_PATTERN = /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(?:-((?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*)(?:\.(?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*))*))?(?:\+([0-9a-zA-Z-]+(?:\.[0-9a-zA-Z-]+)*))?$/;
/**
 * Simple version regex (v1, v2, etc.)
 */
const SIMPLE_VERSION_PATTERN = /^v\d+$/;
/**
 * API version validation schema
 */
exports.APIVersionSchema = zod_1.z.object({
    version: zod_1.z.string().refine((v) => SEMVER_PATTERN.test(v) || SIMPLE_VERSION_PATTERN.test(v), { message: 'Version must be semantic (1.0.0) or simple (v1) format' }),
    status: zod_1.z.nativeEnum(VersionStatus),
    releaseDate: zod_1.z.coerce.date(),
    deprecationDate: zod_1.z.coerce.date().optional(),
    sunsetDate: zod_1.z.coerce.date().optional(),
    retirementDate: zod_1.z.coerce.date().optional(),
    description: zod_1.z.string().optional(),
    changelog: zod_1.z.array(zod_1.z.string()).optional(),
    migrationGuide: zod_1.z.string().optional(),
    documentation: zod_1.z.string().url().optional(),
    supportEmail: zod_1.z.string().email().optional(),
}).refine((data) => {
    if (data.deprecationDate && data.sunsetDate) {
        return data.deprecationDate < data.sunsetDate;
    }
    return true;
}, { message: 'Deprecation date must be before sunset date' }).refine((data) => {
    if (data.sunsetDate && data.retirementDate) {
        return data.sunsetDate < data.retirementDate;
    }
    return true;
}, { message: 'Sunset date must be before retirement date' });
/**
 * Deprecation policy validation schema
 */
exports.DeprecationPolicySchema = zod_1.z.object({
    version: zod_1.z.string(),
    deprecationDate: zod_1.z.coerce.date(),
    sunsetDate: zod_1.z.coerce.date(),
    retirementDate: zod_1.z.coerce.date(),
    reason: zod_1.z.string().min(10),
    replacementVersion: zod_1.z.string().optional(),
    migrationPath: zod_1.z.string().optional(),
    notificationSchedule: zod_1.z.array(zod_1.z.coerce.date()),
    warningLevel: zod_1.z.nativeEnum(DeprecationLevel),
    autoRetire: zod_1.z.boolean().default(false),
}).refine((data) => data.deprecationDate < data.sunsetDate && data.sunsetDate < data.retirementDate, { message: 'Dates must be in order: deprecation < sunset < retirement' });
/**
 * Breaking change validation schema
 */
exports.BreakingChangeSchema = zod_1.z.object({
    type: zod_1.z.nativeEnum(BreakingChangeType),
    field: zod_1.z.string().optional(),
    endpoint: zod_1.z.string().optional(),
    oldValue: zod_1.z.any().optional(),
    newValue: zod_1.z.any().optional(),
    description: zod_1.z.string().min(10),
    migrationSteps: zod_1.z.array(zod_1.z.string()).min(1),
    automatedMigration: zod_1.z.boolean().default(false),
    affectedClients: zod_1.z.array(zod_1.z.string()).optional(),
});
/**
 * Migration guide validation schema
 */
exports.MigrationGuideSchema = zod_1.z.object({
    fromVersion: zod_1.z.string(),
    toVersion: zod_1.z.string(),
    breakingChanges: zod_1.z.array(exports.BreakingChangeSchema),
    steps: zod_1.z.array(zod_1.z.string()).min(1),
    codeExamples: zod_1.z.record(zod_1.z.object({
        before: zod_1.z.string(),
        after: zod_1.z.string(),
    })).optional(),
    estimatedEffort: zod_1.z.string().optional(),
    automationAvailable: zod_1.z.boolean().default(false),
    testingChecklist: zod_1.z.array(zod_1.z.string()),
});
/**
 * Backward compatibility config validation schema
 */
exports.BackwardCompatibilityConfigSchema = zod_1.z.object({
    sourceVersion: zod_1.z.string(),
    targetVersion: zod_1.z.string(),
    transformRequest: zod_1.z.boolean().default(false),
    transformResponse: zod_1.z.boolean().default(false),
    fieldMappings: zod_1.z.record(zod_1.z.string()).optional(),
    defaultValues: zod_1.z.record(zod_1.z.any()).optional(),
    strict: zod_1.z.boolean().default(false),
});
// ============================================================================
// SEQUELIZE MODELS
// ============================================================================
/**
 * API Version Model - Tracks all API versions and their lifecycle
 */
let APIVersionModel = (() => {
    let _classDecorators = [(0, sequelize_typescript_1.Table)({
            tableName: 'api_versions',
            timestamps: true,
            indexes: [
                { fields: ['version'], unique: true },
                { fields: ['status'] },
                { fields: ['deprecation_date'] },
                { fields: ['sunset_date'] },
                { fields: ['retirement_date'] },
            ],
        })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = sequelize_typescript_1.Model;
    let _version_decorators;
    let _version_initializers = [];
    let _version_extraInitializers = [];
    let _status_decorators;
    let _status_initializers = [];
    let _status_extraInitializers = [];
    let _releaseDate_decorators;
    let _releaseDate_initializers = [];
    let _releaseDate_extraInitializers = [];
    let _deprecationDate_decorators;
    let _deprecationDate_initializers = [];
    let _deprecationDate_extraInitializers = [];
    let _sunsetDate_decorators;
    let _sunsetDate_initializers = [];
    let _sunsetDate_extraInitializers = [];
    let _retirementDate_decorators;
    let _retirementDate_initializers = [];
    let _retirementDate_extraInitializers = [];
    let _description_decorators;
    let _description_initializers = [];
    let _description_extraInitializers = [];
    let _changelog_decorators;
    let _changelog_initializers = [];
    let _changelog_extraInitializers = [];
    let _breakingChanges_decorators;
    let _breakingChanges_initializers = [];
    let _breakingChanges_extraInitializers = [];
    let _migrationGuide_decorators;
    let _migrationGuide_initializers = [];
    let _migrationGuide_extraInitializers = [];
    let _documentation_decorators;
    let _documentation_initializers = [];
    let _documentation_extraInitializers = [];
    let _supportEmail_decorators;
    let _supportEmail_initializers = [];
    let _supportEmail_extraInitializers = [];
    let _isActive_decorators;
    let _isActive_initializers = [];
    let _isActive_extraInitializers = [];
    let _createdAt_decorators;
    let _createdAt_initializers = [];
    let _createdAt_extraInitializers = [];
    let _updatedAt_decorators;
    let _updatedAt_initializers = [];
    let _updatedAt_extraInitializers = [];
    var APIVersionModel = _classThis = class extends _classSuper {
        constructor() {
            super(...arguments);
            this.version = __runInitializers(this, _version_initializers, void 0);
            this.status = (__runInitializers(this, _version_extraInitializers), __runInitializers(this, _status_initializers, void 0));
            this.releaseDate = (__runInitializers(this, _status_extraInitializers), __runInitializers(this, _releaseDate_initializers, void 0));
            this.deprecationDate = (__runInitializers(this, _releaseDate_extraInitializers), __runInitializers(this, _deprecationDate_initializers, void 0));
            this.sunsetDate = (__runInitializers(this, _deprecationDate_extraInitializers), __runInitializers(this, _sunsetDate_initializers, void 0));
            this.retirementDate = (__runInitializers(this, _sunsetDate_extraInitializers), __runInitializers(this, _retirementDate_initializers, void 0));
            this.description = (__runInitializers(this, _retirementDate_extraInitializers), __runInitializers(this, _description_initializers, void 0));
            this.changelog = (__runInitializers(this, _description_extraInitializers), __runInitializers(this, _changelog_initializers, void 0));
            this.breakingChanges = (__runInitializers(this, _changelog_extraInitializers), __runInitializers(this, _breakingChanges_initializers, void 0));
            this.migrationGuide = (__runInitializers(this, _breakingChanges_extraInitializers), __runInitializers(this, _migrationGuide_initializers, void 0));
            this.documentation = (__runInitializers(this, _migrationGuide_extraInitializers), __runInitializers(this, _documentation_initializers, void 0));
            this.supportEmail = (__runInitializers(this, _documentation_extraInitializers), __runInitializers(this, _supportEmail_initializers, void 0));
            this.isActive = (__runInitializers(this, _supportEmail_extraInitializers), __runInitializers(this, _isActive_initializers, void 0));
            this.createdAt = (__runInitializers(this, _isActive_extraInitializers), __runInitializers(this, _createdAt_initializers, void 0));
            this.updatedAt = (__runInitializers(this, _createdAt_extraInitializers), __runInitializers(this, _updatedAt_initializers, void 0));
            __runInitializers(this, _updatedAt_extraInitializers);
        }
    };
    __setFunctionName(_classThis, "APIVersionModel");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        _version_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.STRING(50),
                allowNull: false,
                unique: true,
                comment: 'Version identifier (e.g., v1, 1.0.0)',
            })];
        _status_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.ENUM(...Object.values(VersionStatus)),
                allowNull: false,
                defaultValue: VersionStatus.DEVELOPMENT,
                comment: 'Current lifecycle status of the version',
            })];
        _releaseDate_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.DATE,
                allowNull: false,
                comment: 'Date when version was released',
            })];
        _deprecationDate_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.DATE,
                allowNull: true,
                field: 'deprecation_date',
                comment: 'Date when version was deprecated',
            })];
        _sunsetDate_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.DATE,
                allowNull: true,
                field: 'sunset_date',
                comment: 'Date when version enters sunset period',
            })];
        _retirementDate_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.DATE,
                allowNull: true,
                field: 'retirement_date',
                comment: 'Date when version will be retired',
            })];
        _description_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.TEXT,
                allowNull: true,
                comment: 'Version description and features',
            })];
        _changelog_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.JSON,
                allowNull: true,
                comment: 'Array of changelog entries',
            })];
        _breakingChanges_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.JSON,
                allowNull: true,
                comment: 'Breaking changes in this version',
            })];
        _migrationGuide_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.TEXT,
                allowNull: true,
                field: 'migration_guide',
                comment: 'Migration guide URL or text',
            })];
        _documentation_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.STRING(255),
                allowNull: true,
                comment: 'Documentation URL',
            })];
        _supportEmail_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.STRING(255),
                allowNull: true,
                field: 'support_email',
                comment: 'Support contact email',
            })];
        _isActive_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.BOOLEAN,
                allowNull: false,
                defaultValue: true,
                field: 'is_active',
                comment: 'Whether version is currently active',
            })];
        _createdAt_decorators = [sequelize_typescript_1.CreatedAt];
        _updatedAt_decorators = [sequelize_typescript_1.UpdatedAt];
        __esDecorate(null, null, _version_decorators, { kind: "field", name: "version", static: false, private: false, access: { has: obj => "version" in obj, get: obj => obj.version, set: (obj, value) => { obj.version = value; } }, metadata: _metadata }, _version_initializers, _version_extraInitializers);
        __esDecorate(null, null, _status_decorators, { kind: "field", name: "status", static: false, private: false, access: { has: obj => "status" in obj, get: obj => obj.status, set: (obj, value) => { obj.status = value; } }, metadata: _metadata }, _status_initializers, _status_extraInitializers);
        __esDecorate(null, null, _releaseDate_decorators, { kind: "field", name: "releaseDate", static: false, private: false, access: { has: obj => "releaseDate" in obj, get: obj => obj.releaseDate, set: (obj, value) => { obj.releaseDate = value; } }, metadata: _metadata }, _releaseDate_initializers, _releaseDate_extraInitializers);
        __esDecorate(null, null, _deprecationDate_decorators, { kind: "field", name: "deprecationDate", static: false, private: false, access: { has: obj => "deprecationDate" in obj, get: obj => obj.deprecationDate, set: (obj, value) => { obj.deprecationDate = value; } }, metadata: _metadata }, _deprecationDate_initializers, _deprecationDate_extraInitializers);
        __esDecorate(null, null, _sunsetDate_decorators, { kind: "field", name: "sunsetDate", static: false, private: false, access: { has: obj => "sunsetDate" in obj, get: obj => obj.sunsetDate, set: (obj, value) => { obj.sunsetDate = value; } }, metadata: _metadata }, _sunsetDate_initializers, _sunsetDate_extraInitializers);
        __esDecorate(null, null, _retirementDate_decorators, { kind: "field", name: "retirementDate", static: false, private: false, access: { has: obj => "retirementDate" in obj, get: obj => obj.retirementDate, set: (obj, value) => { obj.retirementDate = value; } }, metadata: _metadata }, _retirementDate_initializers, _retirementDate_extraInitializers);
        __esDecorate(null, null, _description_decorators, { kind: "field", name: "description", static: false, private: false, access: { has: obj => "description" in obj, get: obj => obj.description, set: (obj, value) => { obj.description = value; } }, metadata: _metadata }, _description_initializers, _description_extraInitializers);
        __esDecorate(null, null, _changelog_decorators, { kind: "field", name: "changelog", static: false, private: false, access: { has: obj => "changelog" in obj, get: obj => obj.changelog, set: (obj, value) => { obj.changelog = value; } }, metadata: _metadata }, _changelog_initializers, _changelog_extraInitializers);
        __esDecorate(null, null, _breakingChanges_decorators, { kind: "field", name: "breakingChanges", static: false, private: false, access: { has: obj => "breakingChanges" in obj, get: obj => obj.breakingChanges, set: (obj, value) => { obj.breakingChanges = value; } }, metadata: _metadata }, _breakingChanges_initializers, _breakingChanges_extraInitializers);
        __esDecorate(null, null, _migrationGuide_decorators, { kind: "field", name: "migrationGuide", static: false, private: false, access: { has: obj => "migrationGuide" in obj, get: obj => obj.migrationGuide, set: (obj, value) => { obj.migrationGuide = value; } }, metadata: _metadata }, _migrationGuide_initializers, _migrationGuide_extraInitializers);
        __esDecorate(null, null, _documentation_decorators, { kind: "field", name: "documentation", static: false, private: false, access: { has: obj => "documentation" in obj, get: obj => obj.documentation, set: (obj, value) => { obj.documentation = value; } }, metadata: _metadata }, _documentation_initializers, _documentation_extraInitializers);
        __esDecorate(null, null, _supportEmail_decorators, { kind: "field", name: "supportEmail", static: false, private: false, access: { has: obj => "supportEmail" in obj, get: obj => obj.supportEmail, set: (obj, value) => { obj.supportEmail = value; } }, metadata: _metadata }, _supportEmail_initializers, _supportEmail_extraInitializers);
        __esDecorate(null, null, _isActive_decorators, { kind: "field", name: "isActive", static: false, private: false, access: { has: obj => "isActive" in obj, get: obj => obj.isActive, set: (obj, value) => { obj.isActive = value; } }, metadata: _metadata }, _isActive_initializers, _isActive_extraInitializers);
        __esDecorate(null, null, _createdAt_decorators, { kind: "field", name: "createdAt", static: false, private: false, access: { has: obj => "createdAt" in obj, get: obj => obj.createdAt, set: (obj, value) => { obj.createdAt = value; } }, metadata: _metadata }, _createdAt_initializers, _createdAt_extraInitializers);
        __esDecorate(null, null, _updatedAt_decorators, { kind: "field", name: "updatedAt", static: false, private: false, access: { has: obj => "updatedAt" in obj, get: obj => obj.updatedAt, set: (obj, value) => { obj.updatedAt = value; } }, metadata: _metadata }, _updatedAt_initializers, _updatedAt_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        APIVersionModel = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return APIVersionModel = _classThis;
})();
exports.APIVersionModel = APIVersionModel;
/**
 * API Endpoint Version Model - Tracks endpoint-specific versioning
 */
let APIEndpointVersionModel = (() => {
    let _classDecorators = [(0, sequelize_typescript_1.Table)({
            tableName: 'api_endpoint_versions',
            timestamps: true,
            indexes: [
                { fields: ['endpoint', 'version'], unique: true },
                { fields: ['version'] },
                { fields: ['method'] },
                { fields: ['is_deprecated'] },
            ],
        })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = sequelize_typescript_1.Model;
    let _endpoint_decorators;
    let _endpoint_initializers = [];
    let _endpoint_extraInitializers = [];
    let _version_decorators;
    let _version_initializers = [];
    let _version_extraInitializers = [];
    let _method_decorators;
    let _method_initializers = [];
    let _method_extraInitializers = [];
    let _requestSchema_decorators;
    let _requestSchema_initializers = [];
    let _requestSchema_extraInitializers = [];
    let _responseSchema_decorators;
    let _responseSchema_initializers = [];
    let _responseSchema_extraInitializers = [];
    let _isDeprecated_decorators;
    let _isDeprecated_initializers = [];
    let _isDeprecated_extraInitializers = [];
    let _deprecatedSince_decorators;
    let _deprecatedSince_initializers = [];
    let _deprecatedSince_extraInitializers = [];
    let _replacementEndpoint_decorators;
    let _replacementEndpoint_initializers = [];
    let _replacementEndpoint_extraInitializers = [];
    let _metadata_decorators;
    let _metadata_initializers = [];
    let _metadata_extraInitializers = [];
    let _createdAt_decorators;
    let _createdAt_initializers = [];
    let _createdAt_extraInitializers = [];
    let _updatedAt_decorators;
    let _updatedAt_initializers = [];
    let _updatedAt_extraInitializers = [];
    var APIEndpointVersionModel = _classThis = class extends _classSuper {
        constructor() {
            super(...arguments);
            this.endpoint = __runInitializers(this, _endpoint_initializers, void 0);
            this.version = (__runInitializers(this, _endpoint_extraInitializers), __runInitializers(this, _version_initializers, void 0));
            this.method = (__runInitializers(this, _version_extraInitializers), __runInitializers(this, _method_initializers, void 0));
            this.requestSchema = (__runInitializers(this, _method_extraInitializers), __runInitializers(this, _requestSchema_initializers, void 0));
            this.responseSchema = (__runInitializers(this, _requestSchema_extraInitializers), __runInitializers(this, _responseSchema_initializers, void 0));
            this.isDeprecated = (__runInitializers(this, _responseSchema_extraInitializers), __runInitializers(this, _isDeprecated_initializers, void 0));
            this.deprecatedSince = (__runInitializers(this, _isDeprecated_extraInitializers), __runInitializers(this, _deprecatedSince_initializers, void 0));
            this.replacementEndpoint = (__runInitializers(this, _deprecatedSince_extraInitializers), __runInitializers(this, _replacementEndpoint_initializers, void 0));
            this.metadata = (__runInitializers(this, _replacementEndpoint_extraInitializers), __runInitializers(this, _metadata_initializers, void 0));
            this.createdAt = (__runInitializers(this, _metadata_extraInitializers), __runInitializers(this, _createdAt_initializers, void 0));
            this.updatedAt = (__runInitializers(this, _createdAt_extraInitializers), __runInitializers(this, _updatedAt_initializers, void 0));
            __runInitializers(this, _updatedAt_extraInitializers);
        }
    };
    __setFunctionName(_classThis, "APIEndpointVersionModel");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        _endpoint_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.STRING(255),
                allowNull: false,
                comment: 'Endpoint path (e.g., /users/:id)',
            })];
        _version_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.STRING(50),
                allowNull: false,
                comment: 'API version',
            })];
        _method_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.STRING(10),
                allowNull: false,
                comment: 'HTTP method (GET, POST, etc.)',
            })];
        _requestSchema_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.JSON,
                allowNull: true,
                comment: 'Request schema definition',
            })];
        _responseSchema_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.JSON,
                allowNull: true,
                comment: 'Response schema definition',
            })];
        _isDeprecated_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.BOOLEAN,
                allowNull: false,
                defaultValue: false,
                field: 'is_deprecated',
                comment: 'Whether endpoint is deprecated',
            })];
        _deprecatedSince_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.DATE,
                allowNull: true,
                field: 'deprecated_since',
                comment: 'When endpoint was deprecated',
            })];
        _replacementEndpoint_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.STRING(255),
                allowNull: true,
                field: 'replacement_endpoint',
                comment: 'Replacement endpoint if deprecated',
            })];
        _metadata_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.JSON,
                allowNull: true,
                comment: 'Endpoint-specific metadata',
            })];
        _createdAt_decorators = [sequelize_typescript_1.CreatedAt];
        _updatedAt_decorators = [sequelize_typescript_1.UpdatedAt];
        __esDecorate(null, null, _endpoint_decorators, { kind: "field", name: "endpoint", static: false, private: false, access: { has: obj => "endpoint" in obj, get: obj => obj.endpoint, set: (obj, value) => { obj.endpoint = value; } }, metadata: _metadata }, _endpoint_initializers, _endpoint_extraInitializers);
        __esDecorate(null, null, _version_decorators, { kind: "field", name: "version", static: false, private: false, access: { has: obj => "version" in obj, get: obj => obj.version, set: (obj, value) => { obj.version = value; } }, metadata: _metadata }, _version_initializers, _version_extraInitializers);
        __esDecorate(null, null, _method_decorators, { kind: "field", name: "method", static: false, private: false, access: { has: obj => "method" in obj, get: obj => obj.method, set: (obj, value) => { obj.method = value; } }, metadata: _metadata }, _method_initializers, _method_extraInitializers);
        __esDecorate(null, null, _requestSchema_decorators, { kind: "field", name: "requestSchema", static: false, private: false, access: { has: obj => "requestSchema" in obj, get: obj => obj.requestSchema, set: (obj, value) => { obj.requestSchema = value; } }, metadata: _metadata }, _requestSchema_initializers, _requestSchema_extraInitializers);
        __esDecorate(null, null, _responseSchema_decorators, { kind: "field", name: "responseSchema", static: false, private: false, access: { has: obj => "responseSchema" in obj, get: obj => obj.responseSchema, set: (obj, value) => { obj.responseSchema = value; } }, metadata: _metadata }, _responseSchema_initializers, _responseSchema_extraInitializers);
        __esDecorate(null, null, _isDeprecated_decorators, { kind: "field", name: "isDeprecated", static: false, private: false, access: { has: obj => "isDeprecated" in obj, get: obj => obj.isDeprecated, set: (obj, value) => { obj.isDeprecated = value; } }, metadata: _metadata }, _isDeprecated_initializers, _isDeprecated_extraInitializers);
        __esDecorate(null, null, _deprecatedSince_decorators, { kind: "field", name: "deprecatedSince", static: false, private: false, access: { has: obj => "deprecatedSince" in obj, get: obj => obj.deprecatedSince, set: (obj, value) => { obj.deprecatedSince = value; } }, metadata: _metadata }, _deprecatedSince_initializers, _deprecatedSince_extraInitializers);
        __esDecorate(null, null, _replacementEndpoint_decorators, { kind: "field", name: "replacementEndpoint", static: false, private: false, access: { has: obj => "replacementEndpoint" in obj, get: obj => obj.replacementEndpoint, set: (obj, value) => { obj.replacementEndpoint = value; } }, metadata: _metadata }, _replacementEndpoint_initializers, _replacementEndpoint_extraInitializers);
        __esDecorate(null, null, _metadata_decorators, { kind: "field", name: "metadata", static: false, private: false, access: { has: obj => "metadata" in obj, get: obj => obj.metadata, set: (obj, value) => { obj.metadata = value; } }, metadata: _metadata }, _metadata_initializers, _metadata_extraInitializers);
        __esDecorate(null, null, _createdAt_decorators, { kind: "field", name: "createdAt", static: false, private: false, access: { has: obj => "createdAt" in obj, get: obj => obj.createdAt, set: (obj, value) => { obj.createdAt = value; } }, metadata: _metadata }, _createdAt_initializers, _createdAt_extraInitializers);
        __esDecorate(null, null, _updatedAt_decorators, { kind: "field", name: "updatedAt", static: false, private: false, access: { has: obj => "updatedAt" in obj, get: obj => obj.updatedAt, set: (obj, value) => { obj.updatedAt = value; } }, metadata: _metadata }, _updatedAt_initializers, _updatedAt_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        APIEndpointVersionModel = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return APIEndpointVersionModel = _classThis;
})();
exports.APIEndpointVersionModel = APIEndpointVersionModel;
/**
 * Deprecation Schedule Model - Manages deprecation timeline and notifications
 */
let DeprecationScheduleModel = (() => {
    let _classDecorators = [(0, sequelize_typescript_1.Table)({
            tableName: 'deprecation_schedules',
            timestamps: true,
            indexes: [
                { fields: ['version'] },
                { fields: ['sunset_date'] },
                { fields: ['retirement_date'] },
                { fields: ['warning_level'] },
            ],
        })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = sequelize_typescript_1.Model;
    let _version_decorators;
    let _version_initializers = [];
    let _version_extraInitializers = [];
    let _deprecationDate_decorators;
    let _deprecationDate_initializers = [];
    let _deprecationDate_extraInitializers = [];
    let _sunsetDate_decorators;
    let _sunsetDate_initializers = [];
    let _sunsetDate_extraInitializers = [];
    let _retirementDate_decorators;
    let _retirementDate_initializers = [];
    let _retirementDate_extraInitializers = [];
    let _reason_decorators;
    let _reason_initializers = [];
    let _reason_extraInitializers = [];
    let _replacementVersion_decorators;
    let _replacementVersion_initializers = [];
    let _replacementVersion_extraInitializers = [];
    let _migrationPath_decorators;
    let _migrationPath_initializers = [];
    let _migrationPath_extraInitializers = [];
    let _notificationSchedule_decorators;
    let _notificationSchedule_initializers = [];
    let _notificationSchedule_extraInitializers = [];
    let _warningLevel_decorators;
    let _warningLevel_initializers = [];
    let _warningLevel_extraInitializers = [];
    let _autoRetire_decorators;
    let _autoRetire_initializers = [];
    let _autoRetire_extraInitializers = [];
    let _notificationsSent_decorators;
    let _notificationsSent_initializers = [];
    let _notificationsSent_extraInitializers = [];
    let _createdAt_decorators;
    let _createdAt_initializers = [];
    let _createdAt_extraInitializers = [];
    let _updatedAt_decorators;
    let _updatedAt_initializers = [];
    let _updatedAt_extraInitializers = [];
    var DeprecationScheduleModel = _classThis = class extends _classSuper {
        constructor() {
            super(...arguments);
            this.version = __runInitializers(this, _version_initializers, void 0);
            this.deprecationDate = (__runInitializers(this, _version_extraInitializers), __runInitializers(this, _deprecationDate_initializers, void 0));
            this.sunsetDate = (__runInitializers(this, _deprecationDate_extraInitializers), __runInitializers(this, _sunsetDate_initializers, void 0));
            this.retirementDate = (__runInitializers(this, _sunsetDate_extraInitializers), __runInitializers(this, _retirementDate_initializers, void 0));
            this.reason = (__runInitializers(this, _retirementDate_extraInitializers), __runInitializers(this, _reason_initializers, void 0));
            this.replacementVersion = (__runInitializers(this, _reason_extraInitializers), __runInitializers(this, _replacementVersion_initializers, void 0));
            this.migrationPath = (__runInitializers(this, _replacementVersion_extraInitializers), __runInitializers(this, _migrationPath_initializers, void 0));
            this.notificationSchedule = (__runInitializers(this, _migrationPath_extraInitializers), __runInitializers(this, _notificationSchedule_initializers, void 0));
            this.warningLevel = (__runInitializers(this, _notificationSchedule_extraInitializers), __runInitializers(this, _warningLevel_initializers, void 0));
            this.autoRetire = (__runInitializers(this, _warningLevel_extraInitializers), __runInitializers(this, _autoRetire_initializers, void 0));
            this.notificationsSent = (__runInitializers(this, _autoRetire_extraInitializers), __runInitializers(this, _notificationsSent_initializers, void 0));
            this.createdAt = (__runInitializers(this, _notificationsSent_extraInitializers), __runInitializers(this, _createdAt_initializers, void 0));
            this.updatedAt = (__runInitializers(this, _createdAt_extraInitializers), __runInitializers(this, _updatedAt_initializers, void 0));
            __runInitializers(this, _updatedAt_extraInitializers);
        }
    };
    __setFunctionName(_classThis, "DeprecationScheduleModel");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        _version_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.STRING(50),
                allowNull: false,
                comment: 'Deprecated version',
            })];
        _deprecationDate_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.DATE,
                allowNull: false,
                field: 'deprecation_date',
                comment: 'When deprecation was announced',
            })];
        _sunsetDate_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.DATE,
                allowNull: false,
                field: 'sunset_date',
                comment: 'When version enters sunset',
            })];
        _retirementDate_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.DATE,
                allowNull: false,
                field: 'retirement_date',
                comment: 'When version will be retired',
            })];
        _reason_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.TEXT,
                allowNull: false,
                comment: 'Reason for deprecation',
            })];
        _replacementVersion_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.STRING(50),
                allowNull: true,
                field: 'replacement_version',
                comment: 'Version to migrate to',
            })];
        _migrationPath_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.TEXT,
                allowNull: true,
                field: 'migration_path',
                comment: 'Migration instructions URL or text',
            })];
        _notificationSchedule_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.JSON,
                allowNull: false,
                field: 'notification_schedule',
                comment: 'Dates to send notifications',
            })];
        _warningLevel_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.ENUM(...Object.values(DeprecationLevel)),
                allowNull: false,
                defaultValue: DeprecationLevel.INFO,
                field: 'warning_level',
                comment: 'Current warning level',
            })];
        _autoRetire_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.BOOLEAN,
                allowNull: false,
                defaultValue: false,
                field: 'auto_retire',
                comment: 'Whether to auto-retire on retirement date',
            })];
        _notificationsSent_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.JSON,
                allowNull: true,
                field: 'notifications_sent',
                comment: 'Log of sent notifications',
            })];
        _createdAt_decorators = [sequelize_typescript_1.CreatedAt];
        _updatedAt_decorators = [sequelize_typescript_1.UpdatedAt];
        __esDecorate(null, null, _version_decorators, { kind: "field", name: "version", static: false, private: false, access: { has: obj => "version" in obj, get: obj => obj.version, set: (obj, value) => { obj.version = value; } }, metadata: _metadata }, _version_initializers, _version_extraInitializers);
        __esDecorate(null, null, _deprecationDate_decorators, { kind: "field", name: "deprecationDate", static: false, private: false, access: { has: obj => "deprecationDate" in obj, get: obj => obj.deprecationDate, set: (obj, value) => { obj.deprecationDate = value; } }, metadata: _metadata }, _deprecationDate_initializers, _deprecationDate_extraInitializers);
        __esDecorate(null, null, _sunsetDate_decorators, { kind: "field", name: "sunsetDate", static: false, private: false, access: { has: obj => "sunsetDate" in obj, get: obj => obj.sunsetDate, set: (obj, value) => { obj.sunsetDate = value; } }, metadata: _metadata }, _sunsetDate_initializers, _sunsetDate_extraInitializers);
        __esDecorate(null, null, _retirementDate_decorators, { kind: "field", name: "retirementDate", static: false, private: false, access: { has: obj => "retirementDate" in obj, get: obj => obj.retirementDate, set: (obj, value) => { obj.retirementDate = value; } }, metadata: _metadata }, _retirementDate_initializers, _retirementDate_extraInitializers);
        __esDecorate(null, null, _reason_decorators, { kind: "field", name: "reason", static: false, private: false, access: { has: obj => "reason" in obj, get: obj => obj.reason, set: (obj, value) => { obj.reason = value; } }, metadata: _metadata }, _reason_initializers, _reason_extraInitializers);
        __esDecorate(null, null, _replacementVersion_decorators, { kind: "field", name: "replacementVersion", static: false, private: false, access: { has: obj => "replacementVersion" in obj, get: obj => obj.replacementVersion, set: (obj, value) => { obj.replacementVersion = value; } }, metadata: _metadata }, _replacementVersion_initializers, _replacementVersion_extraInitializers);
        __esDecorate(null, null, _migrationPath_decorators, { kind: "field", name: "migrationPath", static: false, private: false, access: { has: obj => "migrationPath" in obj, get: obj => obj.migrationPath, set: (obj, value) => { obj.migrationPath = value; } }, metadata: _metadata }, _migrationPath_initializers, _migrationPath_extraInitializers);
        __esDecorate(null, null, _notificationSchedule_decorators, { kind: "field", name: "notificationSchedule", static: false, private: false, access: { has: obj => "notificationSchedule" in obj, get: obj => obj.notificationSchedule, set: (obj, value) => { obj.notificationSchedule = value; } }, metadata: _metadata }, _notificationSchedule_initializers, _notificationSchedule_extraInitializers);
        __esDecorate(null, null, _warningLevel_decorators, { kind: "field", name: "warningLevel", static: false, private: false, access: { has: obj => "warningLevel" in obj, get: obj => obj.warningLevel, set: (obj, value) => { obj.warningLevel = value; } }, metadata: _metadata }, _warningLevel_initializers, _warningLevel_extraInitializers);
        __esDecorate(null, null, _autoRetire_decorators, { kind: "field", name: "autoRetire", static: false, private: false, access: { has: obj => "autoRetire" in obj, get: obj => obj.autoRetire, set: (obj, value) => { obj.autoRetire = value; } }, metadata: _metadata }, _autoRetire_initializers, _autoRetire_extraInitializers);
        __esDecorate(null, null, _notificationsSent_decorators, { kind: "field", name: "notificationsSent", static: false, private: false, access: { has: obj => "notificationsSent" in obj, get: obj => obj.notificationsSent, set: (obj, value) => { obj.notificationsSent = value; } }, metadata: _metadata }, _notificationsSent_initializers, _notificationsSent_extraInitializers);
        __esDecorate(null, null, _createdAt_decorators, { kind: "field", name: "createdAt", static: false, private: false, access: { has: obj => "createdAt" in obj, get: obj => obj.createdAt, set: (obj, value) => { obj.createdAt = value; } }, metadata: _metadata }, _createdAt_initializers, _createdAt_extraInitializers);
        __esDecorate(null, null, _updatedAt_decorators, { kind: "field", name: "updatedAt", static: false, private: false, access: { has: obj => "updatedAt" in obj, get: obj => obj.updatedAt, set: (obj, value) => { obj.updatedAt = value; } }, metadata: _metadata }, _updatedAt_initializers, _updatedAt_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        DeprecationScheduleModel = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return DeprecationScheduleModel = _classThis;
})();
exports.DeprecationScheduleModel = DeprecationScheduleModel;
/**
 * Version Migration Model - Stores migration guides and change documentation
 */
let VersionMigrationModel = (() => {
    let _classDecorators = [(0, sequelize_typescript_1.Table)({
            tableName: 'version_migrations',
            timestamps: true,
            indexes: [
                { fields: ['from_version', 'to_version'], unique: true },
                { fields: ['from_version'] },
                { fields: ['to_version'] },
            ],
        })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = sequelize_typescript_1.Model;
    let _fromVersion_decorators;
    let _fromVersion_initializers = [];
    let _fromVersion_extraInitializers = [];
    let _toVersion_decorators;
    let _toVersion_initializers = [];
    let _toVersion_extraInitializers = [];
    let _breakingChanges_decorators;
    let _breakingChanges_initializers = [];
    let _breakingChanges_extraInitializers = [];
    let _steps_decorators;
    let _steps_initializers = [];
    let _steps_extraInitializers = [];
    let _codeExamples_decorators;
    let _codeExamples_initializers = [];
    let _codeExamples_extraInitializers = [];
    let _estimatedEffort_decorators;
    let _estimatedEffort_initializers = [];
    let _estimatedEffort_extraInitializers = [];
    let _automationAvailable_decorators;
    let _automationAvailable_initializers = [];
    let _automationAvailable_extraInitializers = [];
    let _testingChecklist_decorators;
    let _testingChecklist_initializers = [];
    let _testingChecklist_extraInitializers = [];
    let _successfulMigrations_decorators;
    let _successfulMigrations_initializers = [];
    let _successfulMigrations_extraInitializers = [];
    let _failedMigrations_decorators;
    let _failedMigrations_initializers = [];
    let _failedMigrations_extraInitializers = [];
    let _createdAt_decorators;
    let _createdAt_initializers = [];
    let _createdAt_extraInitializers = [];
    let _updatedAt_decorators;
    let _updatedAt_initializers = [];
    let _updatedAt_extraInitializers = [];
    var VersionMigrationModel = _classThis = class extends _classSuper {
        constructor() {
            super(...arguments);
            this.fromVersion = __runInitializers(this, _fromVersion_initializers, void 0);
            this.toVersion = (__runInitializers(this, _fromVersion_extraInitializers), __runInitializers(this, _toVersion_initializers, void 0));
            this.breakingChanges = (__runInitializers(this, _toVersion_extraInitializers), __runInitializers(this, _breakingChanges_initializers, void 0));
            this.steps = (__runInitializers(this, _breakingChanges_extraInitializers), __runInitializers(this, _steps_initializers, void 0));
            this.codeExamples = (__runInitializers(this, _steps_extraInitializers), __runInitializers(this, _codeExamples_initializers, void 0));
            this.estimatedEffort = (__runInitializers(this, _codeExamples_extraInitializers), __runInitializers(this, _estimatedEffort_initializers, void 0));
            this.automationAvailable = (__runInitializers(this, _estimatedEffort_extraInitializers), __runInitializers(this, _automationAvailable_initializers, void 0));
            this.testingChecklist = (__runInitializers(this, _automationAvailable_extraInitializers), __runInitializers(this, _testingChecklist_initializers, void 0));
            this.successfulMigrations = (__runInitializers(this, _testingChecklist_extraInitializers), __runInitializers(this, _successfulMigrations_initializers, void 0));
            this.failedMigrations = (__runInitializers(this, _successfulMigrations_extraInitializers), __runInitializers(this, _failedMigrations_initializers, void 0));
            this.createdAt = (__runInitializers(this, _failedMigrations_extraInitializers), __runInitializers(this, _createdAt_initializers, void 0));
            this.updatedAt = (__runInitializers(this, _createdAt_extraInitializers), __runInitializers(this, _updatedAt_initializers, void 0));
            __runInitializers(this, _updatedAt_extraInitializers);
        }
    };
    __setFunctionName(_classThis, "VersionMigrationModel");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        _fromVersion_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.STRING(50),
                allowNull: false,
                field: 'from_version',
                comment: 'Source version',
            })];
        _toVersion_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.STRING(50),
                allowNull: false,
                field: 'to_version',
                comment: 'Target version',
            })];
        _breakingChanges_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.JSON,
                allowNull: false,
                field: 'breaking_changes',
                comment: 'List of breaking changes',
            })];
        _steps_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.JSON,
                allowNull: false,
                comment: 'Step-by-step migration instructions',
            })];
        _codeExamples_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.JSON,
                allowNull: true,
                field: 'code_examples',
                comment: 'Before/after code examples',
            })];
        _estimatedEffort_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.STRING(100),
                allowNull: true,
                field: 'estimated_effort',
                comment: 'Estimated migration effort',
            })];
        _automationAvailable_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.BOOLEAN,
                allowNull: false,
                defaultValue: false,
                field: 'automation_available',
                comment: 'Whether automated migration is available',
            })];
        _testingChecklist_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.JSON,
                allowNull: false,
                field: 'testing_checklist',
                comment: 'Testing checklist items',
            })];
        _successfulMigrations_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.INTEGER,
                allowNull: false,
                defaultValue: 0,
                field: 'successful_migrations',
                comment: 'Count of successful migrations',
            })];
        _failedMigrations_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.INTEGER,
                allowNull: false,
                defaultValue: 0,
                field: 'failed_migrations',
                comment: 'Count of failed migrations',
            })];
        _createdAt_decorators = [sequelize_typescript_1.CreatedAt];
        _updatedAt_decorators = [sequelize_typescript_1.UpdatedAt];
        __esDecorate(null, null, _fromVersion_decorators, { kind: "field", name: "fromVersion", static: false, private: false, access: { has: obj => "fromVersion" in obj, get: obj => obj.fromVersion, set: (obj, value) => { obj.fromVersion = value; } }, metadata: _metadata }, _fromVersion_initializers, _fromVersion_extraInitializers);
        __esDecorate(null, null, _toVersion_decorators, { kind: "field", name: "toVersion", static: false, private: false, access: { has: obj => "toVersion" in obj, get: obj => obj.toVersion, set: (obj, value) => { obj.toVersion = value; } }, metadata: _metadata }, _toVersion_initializers, _toVersion_extraInitializers);
        __esDecorate(null, null, _breakingChanges_decorators, { kind: "field", name: "breakingChanges", static: false, private: false, access: { has: obj => "breakingChanges" in obj, get: obj => obj.breakingChanges, set: (obj, value) => { obj.breakingChanges = value; } }, metadata: _metadata }, _breakingChanges_initializers, _breakingChanges_extraInitializers);
        __esDecorate(null, null, _steps_decorators, { kind: "field", name: "steps", static: false, private: false, access: { has: obj => "steps" in obj, get: obj => obj.steps, set: (obj, value) => { obj.steps = value; } }, metadata: _metadata }, _steps_initializers, _steps_extraInitializers);
        __esDecorate(null, null, _codeExamples_decorators, { kind: "field", name: "codeExamples", static: false, private: false, access: { has: obj => "codeExamples" in obj, get: obj => obj.codeExamples, set: (obj, value) => { obj.codeExamples = value; } }, metadata: _metadata }, _codeExamples_initializers, _codeExamples_extraInitializers);
        __esDecorate(null, null, _estimatedEffort_decorators, { kind: "field", name: "estimatedEffort", static: false, private: false, access: { has: obj => "estimatedEffort" in obj, get: obj => obj.estimatedEffort, set: (obj, value) => { obj.estimatedEffort = value; } }, metadata: _metadata }, _estimatedEffort_initializers, _estimatedEffort_extraInitializers);
        __esDecorate(null, null, _automationAvailable_decorators, { kind: "field", name: "automationAvailable", static: false, private: false, access: { has: obj => "automationAvailable" in obj, get: obj => obj.automationAvailable, set: (obj, value) => { obj.automationAvailable = value; } }, metadata: _metadata }, _automationAvailable_initializers, _automationAvailable_extraInitializers);
        __esDecorate(null, null, _testingChecklist_decorators, { kind: "field", name: "testingChecklist", static: false, private: false, access: { has: obj => "testingChecklist" in obj, get: obj => obj.testingChecklist, set: (obj, value) => { obj.testingChecklist = value; } }, metadata: _metadata }, _testingChecklist_initializers, _testingChecklist_extraInitializers);
        __esDecorate(null, null, _successfulMigrations_decorators, { kind: "field", name: "successfulMigrations", static: false, private: false, access: { has: obj => "successfulMigrations" in obj, get: obj => obj.successfulMigrations, set: (obj, value) => { obj.successfulMigrations = value; } }, metadata: _metadata }, _successfulMigrations_initializers, _successfulMigrations_extraInitializers);
        __esDecorate(null, null, _failedMigrations_decorators, { kind: "field", name: "failedMigrations", static: false, private: false, access: { has: obj => "failedMigrations" in obj, get: obj => obj.failedMigrations, set: (obj, value) => { obj.failedMigrations = value; } }, metadata: _metadata }, _failedMigrations_initializers, _failedMigrations_extraInitializers);
        __esDecorate(null, null, _createdAt_decorators, { kind: "field", name: "createdAt", static: false, private: false, access: { has: obj => "createdAt" in obj, get: obj => obj.createdAt, set: (obj, value) => { obj.createdAt = value; } }, metadata: _metadata }, _createdAt_initializers, _createdAt_extraInitializers);
        __esDecorate(null, null, _updatedAt_decorators, { kind: "field", name: "updatedAt", static: false, private: false, access: { has: obj => "updatedAt" in obj, get: obj => obj.updatedAt, set: (obj, value) => { obj.updatedAt = value; } }, metadata: _metadata }, _updatedAt_initializers, _updatedAt_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        VersionMigrationModel = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return VersionMigrationModel = _classThis;
})();
exports.VersionMigrationModel = VersionMigrationModel;
/**
 * Version Analytics Model - Tracks version usage and adoption metrics
 */
let VersionAnalyticsModel = (() => {
    let _classDecorators = [(0, sequelize_typescript_1.Table)({
            tableName: 'version_analytics',
            timestamps: true,
            indexes: [
                { fields: ['version', 'period_start', 'period_end'] },
                { fields: ['version'] },
                { fields: ['period_start'] },
            ],
        })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = sequelize_typescript_1.Model;
    let _version_decorators;
    let _version_initializers = [];
    let _version_extraInitializers = [];
    let _periodStart_decorators;
    let _periodStart_initializers = [];
    let _periodStart_extraInitializers = [];
    let _periodEnd_decorators;
    let _periodEnd_initializers = [];
    let _periodEnd_extraInitializers = [];
    let _totalRequests_decorators;
    let _totalRequests_initializers = [];
    let _totalRequests_extraInitializers = [];
    let _uniqueClients_decorators;
    let _uniqueClients_initializers = [];
    let _uniqueClients_extraInitializers = [];
    let _errorRate_decorators;
    let _errorRate_initializers = [];
    let _errorRate_extraInitializers = [];
    let _avgResponseTime_decorators;
    let _avgResponseTime_initializers = [];
    let _avgResponseTime_extraInitializers = [];
    let _p95ResponseTime_decorators;
    let _p95ResponseTime_initializers = [];
    let _p95ResponseTime_extraInitializers = [];
    let _p99ResponseTime_decorators;
    let _p99ResponseTime_initializers = [];
    let _p99ResponseTime_extraInitializers = [];
    let _topEndpoints_decorators;
    let _topEndpoints_initializers = [];
    let _topEndpoints_extraInitializers = [];
    let _clientDistribution_decorators;
    let _clientDistribution_initializers = [];
    let _clientDistribution_extraInitializers = [];
    let _metadata_decorators;
    let _metadata_initializers = [];
    let _metadata_extraInitializers = [];
    let _createdAt_decorators;
    let _createdAt_initializers = [];
    let _createdAt_extraInitializers = [];
    let _updatedAt_decorators;
    let _updatedAt_initializers = [];
    let _updatedAt_extraInitializers = [];
    var VersionAnalyticsModel = _classThis = class extends _classSuper {
        constructor() {
            super(...arguments);
            this.version = __runInitializers(this, _version_initializers, void 0);
            this.periodStart = (__runInitializers(this, _version_extraInitializers), __runInitializers(this, _periodStart_initializers, void 0));
            this.periodEnd = (__runInitializers(this, _periodStart_extraInitializers), __runInitializers(this, _periodEnd_initializers, void 0));
            this.totalRequests = (__runInitializers(this, _periodEnd_extraInitializers), __runInitializers(this, _totalRequests_initializers, void 0));
            this.uniqueClients = (__runInitializers(this, _totalRequests_extraInitializers), __runInitializers(this, _uniqueClients_initializers, void 0));
            this.errorRate = (__runInitializers(this, _uniqueClients_extraInitializers), __runInitializers(this, _errorRate_initializers, void 0));
            this.avgResponseTime = (__runInitializers(this, _errorRate_extraInitializers), __runInitializers(this, _avgResponseTime_initializers, void 0));
            this.p95ResponseTime = (__runInitializers(this, _avgResponseTime_extraInitializers), __runInitializers(this, _p95ResponseTime_initializers, void 0));
            this.p99ResponseTime = (__runInitializers(this, _p95ResponseTime_extraInitializers), __runInitializers(this, _p99ResponseTime_initializers, void 0));
            this.topEndpoints = (__runInitializers(this, _p99ResponseTime_extraInitializers), __runInitializers(this, _topEndpoints_initializers, void 0));
            this.clientDistribution = (__runInitializers(this, _topEndpoints_extraInitializers), __runInitializers(this, _clientDistribution_initializers, void 0));
            this.metadata = (__runInitializers(this, _clientDistribution_extraInitializers), __runInitializers(this, _metadata_initializers, void 0));
            this.createdAt = (__runInitializers(this, _metadata_extraInitializers), __runInitializers(this, _createdAt_initializers, void 0));
            this.updatedAt = (__runInitializers(this, _createdAt_extraInitializers), __runInitializers(this, _updatedAt_initializers, void 0));
            __runInitializers(this, _updatedAt_extraInitializers);
        }
    };
    __setFunctionName(_classThis, "VersionAnalyticsModel");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        _version_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.STRING(50),
                allowNull: false,
                comment: 'API version',
            })];
        _periodStart_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.DATE,
                allowNull: false,
                field: 'period_start',
                comment: 'Analytics period start',
            })];
        _periodEnd_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.DATE,
                allowNull: false,
                field: 'period_end',
                comment: 'Analytics period end',
            })];
        _totalRequests_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.BIGINT,
                allowNull: false,
                defaultValue: 0,
                field: 'total_requests',
                comment: 'Total request count',
            })];
        _uniqueClients_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.INTEGER,
                allowNull: false,
                defaultValue: 0,
                field: 'unique_clients',
                comment: 'Unique client count',
            })];
        _errorRate_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.DECIMAL(5, 4),
                allowNull: false,
                defaultValue: 0,
                field: 'error_rate',
                comment: 'Error rate (0-1)',
            })];
        _avgResponseTime_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.INTEGER,
                allowNull: false,
                defaultValue: 0,
                field: 'avg_response_time',
                comment: 'Average response time (ms)',
            })];
        _p95ResponseTime_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.INTEGER,
                allowNull: false,
                defaultValue: 0,
                field: 'p95_response_time',
                comment: '95th percentile response time (ms)',
            })];
        _p99ResponseTime_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.INTEGER,
                allowNull: false,
                defaultValue: 0,
                field: 'p99_response_time',
                comment: '99th percentile response time (ms)',
            })];
        _topEndpoints_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.JSON,
                allowNull: true,
                field: 'top_endpoints',
                comment: 'Most used endpoints',
            })];
        _clientDistribution_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.JSON,
                allowNull: true,
                field: 'client_distribution',
                comment: 'Distribution by client',
            })];
        _metadata_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.JSON,
                allowNull: true,
                comment: 'Additional metadata',
            })];
        _createdAt_decorators = [sequelize_typescript_1.CreatedAt];
        _updatedAt_decorators = [sequelize_typescript_1.UpdatedAt];
        __esDecorate(null, null, _version_decorators, { kind: "field", name: "version", static: false, private: false, access: { has: obj => "version" in obj, get: obj => obj.version, set: (obj, value) => { obj.version = value; } }, metadata: _metadata }, _version_initializers, _version_extraInitializers);
        __esDecorate(null, null, _periodStart_decorators, { kind: "field", name: "periodStart", static: false, private: false, access: { has: obj => "periodStart" in obj, get: obj => obj.periodStart, set: (obj, value) => { obj.periodStart = value; } }, metadata: _metadata }, _periodStart_initializers, _periodStart_extraInitializers);
        __esDecorate(null, null, _periodEnd_decorators, { kind: "field", name: "periodEnd", static: false, private: false, access: { has: obj => "periodEnd" in obj, get: obj => obj.periodEnd, set: (obj, value) => { obj.periodEnd = value; } }, metadata: _metadata }, _periodEnd_initializers, _periodEnd_extraInitializers);
        __esDecorate(null, null, _totalRequests_decorators, { kind: "field", name: "totalRequests", static: false, private: false, access: { has: obj => "totalRequests" in obj, get: obj => obj.totalRequests, set: (obj, value) => { obj.totalRequests = value; } }, metadata: _metadata }, _totalRequests_initializers, _totalRequests_extraInitializers);
        __esDecorate(null, null, _uniqueClients_decorators, { kind: "field", name: "uniqueClients", static: false, private: false, access: { has: obj => "uniqueClients" in obj, get: obj => obj.uniqueClients, set: (obj, value) => { obj.uniqueClients = value; } }, metadata: _metadata }, _uniqueClients_initializers, _uniqueClients_extraInitializers);
        __esDecorate(null, null, _errorRate_decorators, { kind: "field", name: "errorRate", static: false, private: false, access: { has: obj => "errorRate" in obj, get: obj => obj.errorRate, set: (obj, value) => { obj.errorRate = value; } }, metadata: _metadata }, _errorRate_initializers, _errorRate_extraInitializers);
        __esDecorate(null, null, _avgResponseTime_decorators, { kind: "field", name: "avgResponseTime", static: false, private: false, access: { has: obj => "avgResponseTime" in obj, get: obj => obj.avgResponseTime, set: (obj, value) => { obj.avgResponseTime = value; } }, metadata: _metadata }, _avgResponseTime_initializers, _avgResponseTime_extraInitializers);
        __esDecorate(null, null, _p95ResponseTime_decorators, { kind: "field", name: "p95ResponseTime", static: false, private: false, access: { has: obj => "p95ResponseTime" in obj, get: obj => obj.p95ResponseTime, set: (obj, value) => { obj.p95ResponseTime = value; } }, metadata: _metadata }, _p95ResponseTime_initializers, _p95ResponseTime_extraInitializers);
        __esDecorate(null, null, _p99ResponseTime_decorators, { kind: "field", name: "p99ResponseTime", static: false, private: false, access: { has: obj => "p99ResponseTime" in obj, get: obj => obj.p99ResponseTime, set: (obj, value) => { obj.p99ResponseTime = value; } }, metadata: _metadata }, _p99ResponseTime_initializers, _p99ResponseTime_extraInitializers);
        __esDecorate(null, null, _topEndpoints_decorators, { kind: "field", name: "topEndpoints", static: false, private: false, access: { has: obj => "topEndpoints" in obj, get: obj => obj.topEndpoints, set: (obj, value) => { obj.topEndpoints = value; } }, metadata: _metadata }, _topEndpoints_initializers, _topEndpoints_extraInitializers);
        __esDecorate(null, null, _clientDistribution_decorators, { kind: "field", name: "clientDistribution", static: false, private: false, access: { has: obj => "clientDistribution" in obj, get: obj => obj.clientDistribution, set: (obj, value) => { obj.clientDistribution = value; } }, metadata: _metadata }, _clientDistribution_initializers, _clientDistribution_extraInitializers);
        __esDecorate(null, null, _metadata_decorators, { kind: "field", name: "metadata", static: false, private: false, access: { has: obj => "metadata" in obj, get: obj => obj.metadata, set: (obj, value) => { obj.metadata = value; } }, metadata: _metadata }, _metadata_initializers, _metadata_extraInitializers);
        __esDecorate(null, null, _createdAt_decorators, { kind: "field", name: "createdAt", static: false, private: false, access: { has: obj => "createdAt" in obj, get: obj => obj.createdAt, set: (obj, value) => { obj.createdAt = value; } }, metadata: _metadata }, _createdAt_initializers, _createdAt_extraInitializers);
        __esDecorate(null, null, _updatedAt_decorators, { kind: "field", name: "updatedAt", static: false, private: false, access: { has: obj => "updatedAt" in obj, get: obj => obj.updatedAt, set: (obj, value) => { obj.updatedAt = value; } }, metadata: _metadata }, _updatedAt_initializers, _updatedAt_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        VersionAnalyticsModel = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return VersionAnalyticsModel = _classThis;
})();
exports.VersionAnalyticsModel = VersionAnalyticsModel;
// ============================================================================
// CORE VERSIONING FUNCTIONS - URI VERSIONING
// ============================================================================
/**
 * Parse version from URI path
 *
 * @param uri - Request URI
 * @returns Parsed version or null
 *
 * @example
 * parseVersionFromUri('/v1/users') // 'v1'
 * parseVersionFromUri('/api/v2/posts') // 'v2'
 * parseVersionFromUri('/users') // null
 */
function parseVersionFromUri(uri) {
    const match = uri.match(/\/v(\d+)(?:\/|$)/i);
    return match ? `v${match[1]}` : null;
}
/**
 * Validate version URI format
 *
 * @param uri - URI to validate
 * @param allowedVersions - List of allowed versions
 * @returns Validation result
 *
 * @example
 * validateVersionUri('/v1/users', ['v1', 'v2']) // { valid: true, version: 'v1' }
 * validateVersionUri('/v3/users', ['v1', 'v2']) // { valid: false, error: 'Version not allowed' }
 */
function validateVersionUri(uri, allowedVersions) {
    const version = parseVersionFromUri(uri);
    if (!version) {
        return { valid: false, error: 'No version found in URI' };
    }
    if (!allowedVersions.includes(version)) {
        return { valid: false, error: `Version ${version} is not allowed` };
    }
    return { valid: true, version };
}
/**
 * Extract version prefix from path
 *
 * @param path - Request path
 * @returns Path without version prefix
 *
 * @example
 * extractVersionPrefix('/v1/users') // '/users'
 * extractVersionPrefix('/api/v2/posts') // '/api/posts'
 */
function extractVersionPrefix(path) {
    return path.replace(/\/v\d+(?=\/|$)/i, '');
}
/**
 * Create versioned path
 *
 * @param path - Base path
 * @param version - Version to add
 * @param prefix - Optional prefix (default: '')
 * @returns Versioned path
 *
 * @example
 * createVersionedPath('/users', 'v1') // '/v1/users'
 * createVersionedPath('/posts', 'v2', '/api') // '/api/v2/posts'
 */
function createVersionedPath(path, version, prefix = '') {
    const normalizedPath = path.startsWith('/') ? path : `/${path}`;
    const normalizedPrefix = prefix.startsWith('/') ? prefix : `/${prefix}`;
    const versionPath = version.startsWith('v') ? version : `v${version}`;
    if (prefix) {
        return `${normalizedPrefix}/${versionPath}${normalizedPath}`;
    }
    return `/${versionPath}${normalizedPath}`;
}
/**
 * Normalize version URI format
 *
 * @param uri - URI to normalize
 * @returns Normalized URI
 *
 * @example
 * normalizeVersionUri('/V1/users') // '/v1/users'
 * normalizeVersionUri('/api/V2/posts/') // '/api/v2/posts'
 */
function normalizeVersionUri(uri) {
    return uri
        .replace(/\/V(\d+)/gi, '/v$1')
        .replace(/\/+/g, '/')
        .replace(/\/$/, '');
}
/**
 * Check if version format is valid
 *
 * @param version - Version string to validate
 * @returns True if valid
 *
 * @example
 * isValidVersionFormat('v1') // true
 * isValidVersionFormat('1.0.0') // true
 * isValidVersionFormat('invalid') // false
 */
function isValidVersionFormat(version) {
    return SEMVER_PATTERN.test(version) || SIMPLE_VERSION_PATTERN.test(version);
}
// ============================================================================
// CORE VERSIONING FUNCTIONS - HEADER VERSIONING
// ============================================================================
/**
 * Parse version from request header
 *
 * @param headers - Request headers
 * @param headerName - Header name (default: 'X-API-Version')
 * @returns Parsed version or null
 *
 * @example
 * parseVersionFromHeader({ 'x-api-version': 'v1' }) // 'v1'
 * parseVersionFromHeader({ 'accept': 'application/json' }) // null
 */
function parseVersionFromHeader(headers, headerName = 'X-API-Version') {
    const headerValue = headers[headerName.toLowerCase()];
    if (!headerValue)
        return null;
    const version = Array.isArray(headerValue) ? headerValue[0] : headerValue;
    return version.trim() || null;
}
/**
 * Create version header
 *
 * @param version - Version string
 * @param headerName - Header name (default: 'X-API-Version')
 * @returns Header object
 *
 * @example
 * createVersionHeader('v1') // { 'X-API-Version': 'v1' }
 */
function createVersionHeader(version, headerName = 'X-API-Version') {
    return { [headerName]: version };
}
/**
 * Negotiate version from request headers
 *
 * @param headers - Request headers
 * @param availableVersions - List of available versions
 * @param defaultVersion - Default version if not specified
 * @returns Negotiation result
 *
 * @example
 * negotiateVersion(headers, ['v1', 'v2'], 'v2')
 */
function negotiateVersion(headers, availableVersions, defaultVersion) {
    const warnings = [];
    let selectedVersion = null;
    // Try X-API-Version header
    selectedVersion = parseVersionFromHeader(headers, 'X-API-Version');
    // Try Accept header with version
    if (!selectedVersion) {
        const acceptVersion = parseVersionFromAcceptHeader(headers.accept);
        if (acceptVersion) {
            selectedVersion = acceptVersion;
        }
    }
    // Use default if not specified
    if (!selectedVersion) {
        selectedVersion = defaultVersion;
        warnings.push('No version specified, using default');
    }
    // Check if version is available
    const acceptable = availableVersions.includes(selectedVersion);
    if (!acceptable) {
        warnings.push(`Version ${selectedVersion} not available`);
        return {
            selectedVersion,
            strategy: VersionStrategy.HEADER,
            acceptable: false,
            fallbackVersion: defaultVersion,
            warnings,
        };
    }
    return {
        selectedVersion,
        strategy: VersionStrategy.HEADER,
        acceptable: true,
        warnings,
    };
}
/**
 * Validate version header format
 *
 * @param headers - Request headers
 * @param headerName - Header name
 * @returns Validation result
 *
 * @example
 * validateVersionHeader({ 'x-api-version': 'v1' }) // { valid: true, version: 'v1' }
 */
function validateVersionHeader(headers, headerName = 'X-API-Version') {
    const version = parseVersionFromHeader(headers, headerName);
    if (!version) {
        return { valid: false, error: 'Version header not found' };
    }
    if (!isValidVersionFormat(version)) {
        return { valid: false, error: 'Invalid version format' };
    }
    return { valid: true, version };
}
/**
 * Extract custom version header
 *
 * @param headers - Request headers
 * @param customHeaderName - Custom header name
 * @returns Version or null
 *
 * @example
 * extractCustomHeader(headers, 'X-MyApp-Version') // 'v1'
 */
function extractCustomHeader(headers, customHeaderName) {
    return parseVersionFromHeader(headers, customHeaderName);
}
/**
 * Create Accept header with version
 *
 * @param mediaType - Media type (e.g., 'application/json')
 * @param version - Version string
 * @param vendor - Optional vendor prefix
 * @returns Accept header value
 *
 * @example
 * createAcceptVersionHeader('application/json', 'v1', 'myapp')
 * // 'application/vnd.myapp+json;version=v1'
 */
function createAcceptVersionHeader(mediaType, version, vendor) {
    if (vendor) {
        const baseType = mediaType.split('/')[1] || 'json';
        return `application/vnd.${vendor}+${baseType};version=${version}`;
    }
    return `${mediaType};version=${version}`;
}
// ============================================================================
// CORE VERSIONING FUNCTIONS - CONTENT NEGOTIATION
// ============================================================================
/**
 * Parse version from Accept header
 *
 * @param acceptHeader - Accept header value
 * @returns Parsed version or null
 *
 * @example
 * parseVersionFromAcceptHeader('application/vnd.api+json;version=v1') // 'v1'
 * parseVersionFromAcceptHeader('application/json') // null
 */
function parseVersionFromAcceptHeader(acceptHeader) {
    if (!acceptHeader)
        return null;
    // Match version parameter
    const versionMatch = acceptHeader.match(/version=([^\s;,]+)/i);
    if (versionMatch) {
        return versionMatch[1];
    }
    // Match vendor version (application/vnd.api.v1+json)
    const vendorMatch = acceptHeader.match(/vnd\.[^.+]+\.v(\d+)/i);
    if (vendorMatch) {
        return `v${vendorMatch[1]}`;
    }
    return null;
}
/**
 * Select version based on content type negotiation
 *
 * @param acceptHeader - Accept header value
 * @param availableVersions - Available versions
 * @param defaultVersion - Default version
 * @returns Selected version
 *
 * @example
 * selectVersionByContent(acceptHeader, ['v1', 'v2'], 'v2') // 'v1'
 */
function selectVersionByContent(acceptHeader, availableVersions, defaultVersion) {
    const requestedVersion = parseVersionFromAcceptHeader(acceptHeader);
    if (!requestedVersion) {
        return defaultVersion;
    }
    if (availableVersions.includes(requestedVersion)) {
        return requestedVersion;
    }
    return defaultVersion;
}
/**
 * Create Content-Type header with version
 *
 * @param mediaType - Media type
 * @param version - Version
 * @param vendor - Optional vendor
 * @returns Content-Type header value
 *
 * @example
 * createContentTypeVersion('application/json', 'v1') // 'application/json;version=v1'
 */
function createContentTypeVersion(mediaType, version, vendor) {
    if (vendor) {
        const baseType = mediaType.split('/')[1] || 'json';
        return `application/vnd.${vendor}+${baseType};version=${version}`;
    }
    return `${mediaType};version=${version}`;
}
/**
 * Match media type with version
 *
 * @param acceptHeader - Accept header
 * @param mediaType - Media type to match
 * @param version - Version to match
 * @returns True if matches
 *
 * @example
 * matchMediaType('application/json;version=v1', 'application/json', 'v1') // true
 */
function matchMediaType(acceptHeader, mediaType, version) {
    const parsedVersion = parseVersionFromAcceptHeader(acceptHeader);
    const hasMediaType = acceptHeader.includes(mediaType);
    return hasMediaType && parsedVersion === version;
}
/**
 * Prioritize versions from Accept header
 *
 * @param acceptHeader - Accept header with quality values
 * @param availableVersions - Available versions
 * @returns Sorted versions by priority
 *
 * @example
 * prioritizeVersions('application/json;version=v1;q=0.9, application/json;version=v2;q=1.0', ['v1', 'v2'])
 * // ['v2', 'v1']
 */
function prioritizeVersions(acceptHeader, availableVersions) {
    const mediaTypes = acceptHeader.split(',').map((type) => type.trim());
    const scored = mediaTypes
        .map((type) => {
        const version = parseVersionFromAcceptHeader(type);
        const qMatch = type.match(/q=([\d.]+)/);
        const quality = qMatch ? parseFloat(qMatch[1]) : 1.0;
        return { version, quality };
    })
        .filter((item) => item.version && availableVersions.includes(item.version))
        .sort((a, b) => b.quality - a.quality);
    return scored.map((item) => item.version);
}
// ============================================================================
// CORE VERSIONING FUNCTIONS - DEPRECATION MANAGEMENT
// ============================================================================
/**
 * Create deprecation warning message
 *
 * @param version - Deprecated version
 * @param sunsetDate - Sunset date
 * @param replacementVersion - Replacement version
 * @returns Warning message
 *
 * @example
 * createDeprecationWarning('v1', new Date('2025-12-31'), 'v2')
 * // 'Version v1 is deprecated and will be sunset on 2025-12-31. Please migrate to v2.'
 */
function createDeprecationWarning(version, sunsetDate, replacementVersion) {
    const dateStr = sunsetDate.toISOString().split('T')[0];
    let message = `Version ${version} is deprecated and will be sunset on ${dateStr}.`;
    if (replacementVersion) {
        message += ` Please migrate to ${replacementVersion}.`;
    }
    return message;
}
/**
 * Check deprecation status of version
 *
 * @param version - Version to check
 * @param versionMetadata - Version metadata
 * @returns Deprecation status
 *
 * @example
 * checkDeprecationStatus('v1', versionData)
 * // { deprecated: true, level: 'warning', daysRemaining: 30 }
 */
function checkDeprecationStatus(version, versionMetadata) {
    if (versionMetadata.status === VersionStatus.RETIRED) {
        return {
            deprecated: true,
            level: DeprecationLevel.RETIRED,
            daysRemaining: 0,
        };
    }
    if (!versionMetadata.deprecationDate) {
        return {
            deprecated: false,
            level: DeprecationLevel.INFO,
        };
    }
    const now = new Date();
    const sunsetDate = versionMetadata.sunsetDate;
    if (!sunsetDate) {
        return {
            deprecated: true,
            level: DeprecationLevel.WARNING,
        };
    }
    const daysRemaining = Math.ceil((sunsetDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    let level;
    if (daysRemaining <= 0) {
        level = DeprecationLevel.RETIRED;
    }
    else if (daysRemaining <= 30) {
        level = DeprecationLevel.CRITICAL;
    }
    else if (daysRemaining <= 90) {
        level = DeprecationLevel.WARNING;
    }
    else {
        level = DeprecationLevel.INFO;
    }
    return {
        deprecated: true,
        level,
        daysRemaining,
        sunsetDate,
    };
}
/**
 * Calculate sunset date based on deprecation date and policy
 *
 * @param deprecationDate - Date of deprecation
 * @param gracePeriodDays - Grace period in days
 * @returns Sunset date
 *
 * @example
 * calculateSunsetDate(new Date('2025-01-01'), 90) // 2025-04-01
 */
function calculateSunsetDate(deprecationDate, gracePeriodDays) {
    const sunsetDate = new Date(deprecationDate);
    sunsetDate.setDate(sunsetDate.getDate() + gracePeriodDays);
    return sunsetDate;
}
/**
 * Generate Sunset HTTP header
 *
 * @param sunsetDate - Sunset date
 * @param migrationGuideUrl - Optional migration guide URL
 * @returns Sunset header value
 *
 * @example
 * generateSunsetHeader(new Date('2025-12-31'), 'https://api.example.com/migration')
 * // 'Sat, 31 Dec 2025 00:00:00 GMT'
 */
function generateSunsetHeader(sunsetDate, migrationGuideUrl) {
    return sunsetDate.toUTCString();
}
/**
 * Schedule deprecation with notification timeline
 *
 * @param policy - Deprecation policy
 * @returns Notification dates
 *
 * @example
 * scheduleDeprecation(policy)
 * // [Date, Date, Date] - notification dates
 */
function scheduleDeprecation(policy) {
    const notifications = [];
    const now = new Date();
    const { deprecationDate, sunsetDate } = policy;
    // Immediate notification
    if (deprecationDate <= now) {
        notifications.push(now);
    }
    // Calculate notification intervals
    const totalDays = Math.ceil((sunsetDate.getTime() - deprecationDate.getTime()) / (1000 * 60 * 60 * 24));
    // Notify at 75%, 50%, 25%, and 10% of grace period
    const percentages = [0.75, 0.5, 0.25, 0.1];
    percentages.forEach((pct) => {
        const notifyDate = new Date(deprecationDate);
        notifyDate.setDate(notifyDate.getDate() + Math.floor(totalDays * (1 - pct)));
        if (notifyDate > now && notifyDate < sunsetDate) {
            notifications.push(notifyDate);
        }
    });
    // Final warning 7 days before sunset
    const finalWarning = new Date(sunsetDate);
    finalWarning.setDate(finalWarning.getDate() - 7);
    if (finalWarning > now) {
        notifications.push(finalWarning);
    }
    return notifications.sort((a, b) => a.getTime() - b.getTime());
}
/**
 * Create deprecation notification message
 *
 * @param version - Deprecated version
 * @param policy - Deprecation policy
 * @param daysRemaining - Days until sunset
 * @returns Notification message
 *
 * @example
 * notifyDeprecation('v1', policy, 30)
 */
function notifyDeprecation(version, policy, daysRemaining) {
    let urgency = 'Notice';
    if (daysRemaining <= 7)
        urgency = 'URGENT';
    else if (daysRemaining <= 30)
        urgency = 'Warning';
    let message = `[${urgency}] API Version ${version} Deprecation\n\n`;
    message += `Version ${version} will be sunset in ${daysRemaining} days on ${policy.sunsetDate.toISOString().split('T')[0]}.\n\n`;
    message += `Reason: ${policy.reason}\n\n`;
    if (policy.replacementVersion) {
        message += `Please migrate to version ${policy.replacementVersion}.\n`;
    }
    if (policy.migrationPath) {
        message += `Migration guide: ${policy.migrationPath}\n`;
    }
    return message;
}
/**
 * Check if version is deprecated
 *
 * @param version - Version to check
 * @param versionMetadata - Version metadata
 * @returns True if deprecated
 *
 * @example
 * isVersionDeprecated('v1', versionData) // true
 */
function isVersionDeprecated(version, versionMetadata) {
    return (versionMetadata.status === VersionStatus.DEPRECATED ||
        versionMetadata.status === VersionStatus.SUNSET ||
        versionMetadata.status === VersionStatus.RETIRED);
}
/**
 * Get remaining lifetime of version
 *
 * @param versionMetadata - Version metadata
 * @returns Days remaining or -1 if no sunset date
 *
 * @example
 * getRemainingLifetime(versionData) // 45
 */
function getRemainingLifetime(versionMetadata) {
    if (!versionMetadata.sunsetDate) {
        return -1;
    }
    const now = new Date();
    const daysRemaining = Math.ceil((versionMetadata.sunsetDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    return Math.max(0, daysRemaining);
}
// ============================================================================
// CORE VERSIONING FUNCTIONS - MIGRATION HELPERS
// ============================================================================
/**
 * Generate migration guide
 *
 * @param fromVersion - Source version
 * @param toVersion - Target version
 * @param breakingChanges - List of breaking changes
 * @returns Migration guide
 *
 * @example
 * generateMigrationGuide('v1', 'v2', changes)
 */
function generateMigrationGuide(fromVersion, toVersion, breakingChanges) {
    const steps = [];
    const codeExamples = {};
    // Generate steps from breaking changes
    breakingChanges.forEach((change, index) => {
        steps.push(`Step ${index + 1}: ${change.description}`);
        change.migrationSteps.forEach((step) => {
            steps.push(`  - ${step}`);
        });
        // Generate code examples for field changes
        if (change.type === BreakingChangeType.FIELD_RENAMED && change.field) {
            codeExamples[change.field] = {
                before: `{ "${change.field}": ${JSON.stringify(change.oldValue)} }`,
                after: `{ "${change.newValue}": ${JSON.stringify(change.oldValue)} }`,
            };
        }
    });
    // Testing checklist
    const testingChecklist = [
        'Update API client to target new version',
        'Update request/response models',
        'Run integration tests',
        'Verify error handling',
        'Test backward compatibility if using both versions',
        'Monitor error rates after deployment',
    ];
    return {
        fromVersion,
        toVersion,
        breakingChanges,
        steps,
        codeExamples,
        estimatedEffort: `${breakingChanges.length * 2} hours`,
        automationAvailable: breakingChanges.every((c) => c.automatedMigration),
        testingChecklist,
    };
}
/**
 * Detect breaking changes between versions
 *
 * @param oldSchema - Old API schema
 * @param newSchema - New API schema
 * @returns List of breaking changes
 *
 * @example
 * detectBreakingChanges(oldSchema, newSchema)
 */
function detectBreakingChanges(oldSchema, newSchema) {
    const changes = [];
    // Detect removed fields
    if (oldSchema.properties && newSchema.properties) {
        Object.keys(oldSchema.properties).forEach((field) => {
            if (!newSchema.properties[field]) {
                changes.push({
                    type: BreakingChangeType.FIELD_REMOVED,
                    field,
                    oldValue: oldSchema.properties[field],
                    description: `Field "${field}" has been removed`,
                    migrationSteps: [
                        `Remove references to "${field}" field`,
                        'Update client code to handle missing field',
                    ],
                    automatedMigration: false,
                });
            }
        });
        // Detect type changes
        Object.keys(oldSchema.properties).forEach((field) => {
            if (newSchema.properties[field]) {
                const oldType = oldSchema.properties[field].type;
                const newType = newSchema.properties[field].type;
                if (oldType !== newType) {
                    changes.push({
                        type: BreakingChangeType.TYPE_CHANGED,
                        field,
                        oldValue: oldType,
                        newValue: newType,
                        description: `Field "${field}" type changed from ${oldType} to ${newType}`,
                        migrationSteps: [
                            `Update "${field}" field type in client models`,
                            'Add type conversion logic if needed',
                        ],
                        automatedMigration: false,
                    });
                }
            }
        });
    }
    return changes;
}
/**
 * Create backward compatibility layer
 *
 * @param config - Compatibility configuration
 * @returns Transform functions
 *
 * @example
 * createCompatibilityLayer(config)
 */
function createCompatibilityLayer(config) {
    const transformRequest = (data) => {
        if (!config.transformRequest)
            return data;
        const transformed = { ...data };
        // Apply field mappings
        if (config.fieldMappings) {
            Object.entries(config.fieldMappings).forEach(([oldField, newField]) => {
                if (oldField in transformed) {
                    transformed[newField] = transformed[oldField];
                    delete transformed[oldField];
                }
            });
        }
        // Apply default values
        if (config.defaultValues) {
            Object.entries(config.defaultValues).forEach(([field, value]) => {
                if (!(field in transformed)) {
                    transformed[field] = value;
                }
            });
        }
        // Apply custom transformers
        if (config.customTransformers) {
            Object.entries(config.customTransformers).forEach(([field, transformer]) => {
                if (field in transformed) {
                    transformed[field] = transformer(transformed[field]);
                }
            });
        }
        return transformed;
    };
    const transformResponse = (data) => {
        if (!config.transformResponse)
            return data;
        const transformed = { ...data };
        // Reverse field mappings
        if (config.fieldMappings) {
            Object.entries(config.fieldMappings).forEach(([oldField, newField]) => {
                if (newField in transformed) {
                    transformed[oldField] = transformed[newField];
                    delete transformed[newField];
                }
            });
        }
        return transformed;
    };
    return { transformRequest, transformResponse };
}
/**
 * Transform request to target version
 *
 * @param request - Request data
 * @param fromVersion - Source version
 * @param toVersion - Target version
 * @param config - Compatibility config
 * @returns Transformed request
 *
 * @example
 * transformRequestToVersion(data, 'v1', 'v2', config)
 */
function transformRequestToVersion(request, fromVersion, toVersion, config) {
    const { transformRequest } = createCompatibilityLayer(config);
    return transformRequest(request);
}
/**
 * Transform response from version
 *
 * @param response - Response data
 * @param fromVersion - Source version
 * @param toVersion - Target version
 * @param config - Compatibility config
 * @returns Transformed response
 *
 * @example
 * transformResponseFromVersion(data, 'v2', 'v1', config)
 */
function transformResponseFromVersion(response, fromVersion, toVersion, config) {
    const { transformResponse } = createCompatibilityLayer(config);
    return transformResponse(response);
}
/**
 * Validate backward compatibility
 *
 * @param oldVersion - Old version data
 * @param newVersion - New version data
 * @param config - Compatibility config
 * @returns Validation result
 *
 * @example
 * validateBackwardCompatibility(oldData, newData, config)
 */
function validateBackwardCompatibility(oldVersion, newVersion, config) {
    const errors = [];
    // Check if all old fields are mapped or have defaults
    const oldFields = Object.keys(oldVersion);
    const mappedFields = new Set(Object.keys(config.fieldMappings || {}));
    const defaultFields = new Set(Object.keys(config.defaultValues || {}));
    oldFields.forEach((field) => {
        if (!mappedFields.has(field) && !defaultFields.has(field) && !(field in newVersion)) {
            if (config.strict) {
                errors.push(`Field "${field}" is not mapped and has no default value`);
            }
        }
    });
    return {
        compatible: errors.length === 0,
        errors,
    };
}
/**
 * Generate changelog
 *
 * @param fromVersion - Source version
 * @param toVersion - Target version
 * @param changes - List of changes
 * @returns Formatted changelog
 *
 * @example
 * generateChangeLog('v1', 'v2', changes)
 */
function generateChangeLog(fromVersion, toVersion, changes) {
    let changelog = `# Changelog: ${fromVersion} → ${toVersion}\n\n`;
    const grouped = changes.reduce((acc, change) => {
        if (!acc[change.type]) {
            acc[change.type] = [];
        }
        acc[change.type].push(change);
        return acc;
    }, {});
    Object.entries(grouped).forEach(([type, typeChanges]) => {
        changelog += `## ${type.replace(/_/g, ' ').toUpperCase()}\n\n`;
        typeChanges.forEach((change) => {
            changelog += `- ${change.description}\n`;
            if (change.field) {
                changelog += `  - Field: \`${change.field}\`\n`;
            }
            if (change.endpoint) {
                changelog += `  - Endpoint: \`${change.endpoint}\`\n`;
            }
        });
        changelog += '\n';
    });
    return changelog;
}
// ============================================================================
// CORE VERSIONING FUNCTIONS - VERSION ANALYTICS
// ============================================================================
/**
 * Track version usage
 *
 * @param version - API version
 * @param clientId - Client identifier
 * @param endpoint - Endpoint path
 * @param responseTime - Response time in ms
 * @param statusCode - HTTP status code
 *
 * @example
 * trackVersionUsage('v1', 'client-123', '/users', 150, 200)
 */
function trackVersionUsage(version, clientId, endpoint, responseTime, statusCode) {
    // In production, this would store to database or analytics service
    const event = {
        version,
        clientId,
        endpoint,
        responseTime,
        statusCode,
        timestamp: new Date(),
        isError: statusCode >= 400,
    };
    // Log or store event
    console.log('[Version Analytics]', event);
}
/**
 * Get version usage metrics
 *
 * @param version - API version
 * @param startDate - Period start
 * @param endDate - Period end
 * @returns Analytics data
 *
 * @example
 * await getVersionMetrics('v1', startDate, endDate)
 */
async function getVersionMetrics(version, startDate, endDate) {
    // In production, query from analytics database
    const analytics = await VersionAnalyticsModel.findOne({
        where: {
            version,
            periodStart: startDate,
            periodEnd: endDate,
        },
    });
    if (!analytics) {
        return {
            version,
            totalRequests: 0,
            uniqueClients: 0,
            errorRate: 0,
            avgResponseTime: 0,
            p95ResponseTime: 0,
            p99ResponseTime: 0,
            topEndpoints: [],
            clientDistribution: {},
            periodStart: startDate,
            periodEnd: endDate,
        };
    }
    return {
        version: analytics.version,
        totalRequests: Number(analytics.totalRequests),
        uniqueClients: analytics.uniqueClients,
        errorRate: Number(analytics.errorRate),
        avgResponseTime: analytics.avgResponseTime,
        p95ResponseTime: analytics.p95ResponseTime,
        p99ResponseTime: analytics.p99ResponseTime,
        topEndpoints: analytics.topEndpoints || [],
        clientDistribution: analytics.clientDistribution || {},
        periodStart: analytics.periodStart,
        periodEnd: analytics.periodEnd,
    };
}
/**
 * Analyze version adoption rate
 *
 * @param versions - List of versions to analyze
 * @param startDate - Period start
 * @param endDate - Period end
 * @returns Adoption metrics
 *
 * @example
 * await analyzeVersionAdoption(['v1', 'v2'], startDate, endDate)
 */
async function analyzeVersionAdoption(versions, startDate, endDate) {
    const results = {};
    let totalRequests = 0;
    const versionRequests = {};
    for (const version of versions) {
        const metrics = await getVersionMetrics(version, startDate, endDate);
        versionRequests[version] = metrics.totalRequests;
        totalRequests += metrics.totalRequests;
    }
    for (const version of versions) {
        const requests = versionRequests[version];
        const percentage = totalRequests > 0 ? (requests / totalRequests) * 100 : 0;
        // Simple trend calculation (would be more sophisticated in production)
        let trend = 'stable';
        if (percentage > 50)
            trend = 'growing';
        if (percentage < 10)
            trend = 'declining';
        results[version] = {
            percentage: Math.round(percentage * 100) / 100,
            requests,
            trend,
        };
    }
    return results;
}
/**
 * Calculate migration rate
 *
 * @param fromVersion - Source version
 * @param toVersion - Target version
 * @param startDate - Period start
 * @param endDate - Period end
 * @returns Migration percentage
 *
 * @example
 * await calculateMigrationRate('v1', 'v2', startDate, endDate)
 */
async function calculateMigrationRate(fromVersion, toVersion, startDate, endDate) {
    const fromMetrics = await getVersionMetrics(fromVersion, startDate, endDate);
    const toMetrics = await getVersionMetrics(toVersion, startDate, endDate);
    const totalRequests = fromMetrics.totalRequests + toMetrics.totalRequests;
    if (totalRequests === 0)
        return 0;
    return (toMetrics.totalRequests / totalRequests) * 100;
}
/**
 * Get version distribution
 *
 * @param startDate - Period start
 * @param endDate - Period end
 * @returns Version distribution
 *
 * @example
 * await getVersionDistribution(startDate, endDate)
 */
async function getVersionDistribution(startDate, endDate) {
    const allVersions = await APIVersionModel.findAll({
        where: { isActive: true },
    });
    const distribution = [];
    let totalRequests = 0;
    for (const versionModel of allVersions) {
        const metrics = await getVersionMetrics(versionModel.version, startDate, endDate);
        distribution.push({
            version: versionModel.version,
            requests: metrics.totalRequests,
            percentage: 0, // Will calculate after total is known
        });
        totalRequests += metrics.totalRequests;
    }
    // Calculate percentages
    distribution.forEach((item) => {
        item.percentage = totalRequests > 0 ? (item.requests / totalRequests) * 100 : 0;
    });
    return distribution.sort((a, b) => b.requests - a.requests);
}
/**
 * Generate version analytics report
 *
 * @param startDate - Period start
 * @param endDate - Period end
 * @returns Formatted report
 *
 * @example
 * await generateVersionReport(startDate, endDate)
 */
async function generateVersionReport(startDate, endDate) {
    const distribution = await getVersionDistribution(startDate, endDate);
    let report = `# API Version Analytics Report\n\n`;
    report += `Period: ${startDate.toISOString().split('T')[0]} to ${endDate.toISOString().split('T')[0]}\n\n`;
    report += `## Version Distribution\n\n`;
    distribution.forEach((item) => {
        report += `- ${item.version}: ${item.requests.toLocaleString()} requests (${item.percentage.toFixed(2)}%)\n`;
    });
    report += `\n## Recommendations\n\n`;
    // Add recommendations based on distribution
    const deprecatedVersions = distribution.filter((item) => item.percentage < 5);
    if (deprecatedVersions.length > 0) {
        report += `Consider retiring versions with low usage:\n`;
        deprecatedVersions.forEach((item) => {
            report += `- ${item.version} (${item.percentage.toFixed(2)}% usage)\n`;
        });
    }
    return report;
}
// ============================================================================
// CORE VERSIONING FUNCTIONS - VERSION ROUTING
// ============================================================================
/**
 * Route request to appropriate version handler
 *
 * @param version - Requested version
 * @param routes - Available version routes
 * @returns Route handler or null
 *
 * @example
 * routeToVersion('v1', routes)
 */
function routeToVersion(version, routes) {
    return routes.find((route) => route.version === version) || null;
}
/**
 * Create version-aware middleware
 *
 * @param defaultVersion - Default version
 * @param strategy - Versioning strategy
 * @returns Express middleware
 *
 * @example
 * app.use(createVersionMiddleware('v2', VersionStrategy.HEADER))
 */
function createVersionMiddleware(defaultVersion, strategy = VersionStrategy.URI) {
    return (req, res, next) => {
        let version = null;
        switch (strategy) {
            case VersionStrategy.URI:
                version = parseVersionFromUri(req.path);
                break;
            case VersionStrategy.HEADER:
            case VersionStrategy.ACCEPT_HEADER:
                version = parseVersionFromHeader(req.headers);
                break;
            case VersionStrategy.QUERY_PARAM:
                version = req.query.version || null;
                break;
        }
        // Attach version to request
        req.apiVersion = version || defaultVersion;
        // Add version header to response
        res.setHeader('X-API-Version', req.apiVersion);
        next();
    };
}
/**
 * Register versioned route
 *
 * @param config - Route configuration
 * @returns Route config
 *
 * @example
 * registerVersionedRoute({ version: 'v1', path: '/users', handler, method: 'GET' })
 */
function registerVersionedRoute(config) {
    // In production, this would register with router
    return config;
}
/**
 * Get version handler for request
 *
 * @param version - Requested version
 * @param path - Request path
 * @param method - HTTP method
 * @param routes - Available routes
 * @returns Handler or null
 *
 * @example
 * getVersionHandler('v1', '/users', 'GET', routes)
 */
function getVersionHandler(version, path, method, routes) {
    const route = routes.find((r) => r.version === version && r.path === path && r.method === method);
    return route ? route.handler : null;
}
/**
 * Resolve version conflicts
 *
 * @param requestedVersion - Client requested version
 * @param availableVersions - Available versions
 * @param strategy - Resolution strategy
 * @returns Resolved version
 *
 * @example
 * resolveVersionConflict('v3', ['v1', 'v2'], 'latest')
 */
function resolveVersionConflict(requestedVersion, availableVersions, strategy = 'latest') {
    if (availableVersions.includes(requestedVersion)) {
        return requestedVersion;
    }
    switch (strategy) {
        case 'latest':
            return availableVersions[availableVersions.length - 1];
        case 'closest':
            // Simple numeric comparison for v1, v2, etc.
            const requested = parseInt(requestedVersion.replace('v', ''));
            const available = availableVersions
                .map((v) => parseInt(v.replace('v', '')))
                .filter((n) => !isNaN(n))
                .sort((a, b) => a - b);
            const closest = available.reduce((prev, curr) => Math.abs(curr - requested) < Math.abs(prev - requested) ? curr : prev);
            return `v${closest}`;
        case 'fail':
        default:
            return null;
    }
}
/**
 * Create version-specific router
 *
 * @param version - Version identifier
 * @param routes - Routes for this version
 * @returns Router configuration
 *
 * @example
 * createVersionRouter('v1', routes)
 */
function createVersionRouter(version, routes) {
    return { version, routes };
}
/**
 * Validate version access
 *
 * @param version - Requested version
 * @param clientId - Client identifier
 * @param versionMetadata - Version metadata
 * @returns Access result
 *
 * @example
 * validateVersionAccess('v1', 'client-123', versionData)
 */
function validateVersionAccess(version, clientId, versionMetadata) {
    // Check if version is retired
    if (versionMetadata.status === VersionStatus.RETIRED) {
        return {
            allowed: false,
            reason: 'Version has been retired',
        };
    }
    // Check if version is in development
    if (versionMetadata.status === VersionStatus.DEVELOPMENT) {
        // In production, you'd check if client has beta access
        return {
            allowed: false,
            reason: 'Version is in development',
        };
    }
    return { allowed: true };
}
/**
 * Apply version policy
 *
 * @param version - Version
 * @param policy - Version policy
 * @param request - Request object
 * @returns Policy result
 *
 * @example
 * applyVersionPolicy('v1', policy, req)
 */
function applyVersionPolicy(version, policy, request) {
    // Check minimum version
    if (policy.minVersion && compareVersions(version, policy.minVersion) < 0) {
        return {
            allowed: false,
            reason: `Minimum version ${policy.minVersion} required`,
        };
    }
    // Check maximum version
    if (policy.maxVersion && compareVersions(version, policy.maxVersion) > 0) {
        return {
            allowed: false,
            reason: `Maximum version ${policy.maxVersion} exceeded`,
        };
    }
    return { allowed: true };
}
/**
 * Compare two version strings
 *
 * @param version1 - First version
 * @param version2 - Second version
 * @returns Comparison result (1, 0, -1)
 *
 * @example
 * compareVersions('v2', 'v1') // 1
 * compareVersions('v1', 'v1') // 0
 * compareVersions('v1', 'v2') // -1
 */
function compareVersions(version1, version2) {
    // Simple version comparison (v1, v2, etc.)
    const v1 = parseInt(version1.replace('v', ''));
    const v2 = parseInt(version2.replace('v', ''));
    if (isNaN(v1) || isNaN(v2)) {
        return VersionComparison.INCOMPATIBLE;
    }
    if (v1 > v2)
        return VersionComparison.GREATER;
    if (v1 < v2)
        return VersionComparison.LESS;
    return VersionComparison.EQUAL;
}
// ============================================================================
// NESTJS DECORATORS
// ============================================================================
/**
 * Metadata key for API version
 */
exports.API_VERSION_KEY = 'api_version';
/**
 * Metadata key for deprecated endpoints
 */
exports.DEPRECATED_KEY = 'deprecated';
/**
 * Metadata key for sunset date
 */
exports.SUNSET_DATE_KEY = 'sunset_date';
/**
 * @ApiVersion decorator - Specify API version for endpoint
 *
 * @param version - API version
 *
 * @example
 * @ApiVersion('v1')
 * @Get('/users')
 * getUsers() {}
 */
const ApiVersion = (version) => {
    return (0, common_1.applyDecorators)((0, common_1.SetMetadata)(exports.API_VERSION_KEY, version), (0, swagger_1.ApiHeader)({
        name: 'X-API-Version',
        description: 'API Version',
        required: false,
        schema: { default: version },
    }));
};
exports.ApiVersion = ApiVersion;
/**
 * @DeprecatedEndpoint decorator - Mark endpoint as deprecated
 *
 * @param sunsetDate - When endpoint will be removed
 * @param replacementEndpoint - Replacement endpoint
 * @param message - Deprecation message
 *
 * @example
 * @DeprecatedEndpoint(new Date('2025-12-31'), '/v2/users', 'Use v2 instead')
 * @Get('/users')
 * getUsers() {}
 */
const DeprecatedEndpoint = (sunsetDate, replacementEndpoint, message) => {
    return (0, common_1.applyDecorators)((0, common_1.SetMetadata)(exports.DEPRECATED_KEY, true), (0, common_1.SetMetadata)(exports.SUNSET_DATE_KEY, sunsetDate), (0, swagger_1.ApiResponse)({
        status: 299,
        description: 'Deprecated - ' + (message || `Sunset on ${sunsetDate.toISOString().split('T')[0]}`),
        headers: {
            'Sunset': {
                description: 'Date when endpoint will be retired',
                schema: { type: 'string', example: sunsetDate.toUTCString() },
            },
            'Deprecation': {
                description: 'Deprecation date',
                schema: { type: 'string', example: new Date().toUTCString() },
            },
            ...(replacementEndpoint && {
                'Link': {
                    description: 'Link to replacement endpoint',
                    schema: { type: 'string', example: `<${replacementEndpoint}>; rel="successor-version"` },
                },
            }),
        },
    }));
};
exports.DeprecatedEndpoint = DeprecatedEndpoint;
/**
 * @SunsetDate decorator - Set sunset date for version
 *
 * @param date - Sunset date
 *
 * @example
 * @SunsetDate(new Date('2025-12-31'))
 * @Get('/users')
 * getUsers() {}
 */
const SunsetDate = (date) => {
    return (0, common_1.SetMetadata)(exports.SUNSET_DATE_KEY, date);
};
exports.SunsetDate = SunsetDate;
/**
 * @RequiresVersion decorator - Require specific version range
 *
 * @param minVersion - Minimum version
 * @param maxVersion - Maximum version
 *
 * @example
 * @RequiresVersion('v1', 'v2')
 * @Get('/users')
 * getUsers() {}
 */
const RequiresVersion = (minVersion, maxVersion) => {
    return (0, common_1.SetMetadata)('version_requirements', { minVersion, maxVersion });
};
exports.RequiresVersion = RequiresVersion;
/**
 * @CurrentVersion parameter decorator - Inject current API version
 *
 * @example
 * getUsers(@CurrentVersion() version: string) {}
 */
exports.CurrentVersion = (0, common_1.createParamDecorator)((data, ctx) => {
    const request = ctx.switchToHttp().getRequest();
    return request.apiVersion || 'v1';
});
// ============================================================================
// NESTJS GUARDS
// ============================================================================
/**
 * Version Guard - Validate API version access
 */
let VersionGuard = (() => {
    let _classDecorators = [(0, common_1.Injectable)()];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    var VersionGuard = _classThis = class {
        constructor(reflector) {
            this.reflector = reflector;
        }
        async canActivate(context) {
            const request = context.switchToHttp().getRequest();
            const response = context.switchToHttp().getResponse();
            // Get version from request
            const version = request.apiVersion;
            if (!version) {
                throw new common_1.BadRequestException('API version not specified');
            }
            // Get version metadata from database
            const versionModel = await APIVersionModel.findOne({
                where: { version },
            });
            if (!versionModel) {
                throw new common_1.BadRequestException(`API version ${version} not found`);
            }
            // Check if version is accessible
            const clientId = request.user?.id || 'anonymous';
            const versionData = {
                version: versionModel.version,
                status: versionModel.status,
                releaseDate: versionModel.releaseDate,
                deprecationDate: versionModel.deprecationDate,
                sunsetDate: versionModel.sunsetDate,
                retirementDate: versionModel.retirementDate,
            };
            const accessResult = validateVersionAccess(version, clientId, versionData);
            if (!accessResult.allowed) {
                throw new ForbiddenException(accessResult.reason);
            }
            // Add deprecation headers if needed
            if (isVersionDeprecated(version, versionData)) {
                const deprecationStatus = checkDeprecationStatus(version, versionData);
                response.setHeader('Deprecation', 'true');
                if (versionData.sunsetDate) {
                    response.setHeader('Sunset', generateSunsetHeader(versionData.sunsetDate));
                }
                const warning = createDeprecationWarning(version, versionData.sunsetDate || new Date(), versionModel.replacementVersion);
                response.setHeader('Warning', `299 - "${warning}"`);
            }
            return true;
        }
    };
    __setFunctionName(_classThis, "VersionGuard");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        VersionGuard = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return VersionGuard = _classThis;
})();
exports.VersionGuard = VersionGuard;
/**
 * Deprecation Interceptor - Add deprecation warnings to responses
 */
let DeprecationInterceptor = (() => {
    let _classDecorators = [(0, common_1.Injectable)()];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    var DeprecationInterceptor = _classThis = class {
        constructor(reflector) {
            this.reflector = reflector;
        }
        intercept(context, next) {
            const response = context.switchToHttp().getResponse();
            const request = context.switchToHttp().getRequest();
            const isDeprecated = this.reflector.get(exports.DEPRECATED_KEY, context.getHandler());
            const sunsetDate = this.reflector.get(exports.SUNSET_DATE_KEY, context.getHandler());
            if (isDeprecated && sunsetDate) {
                response.setHeader('Deprecation', 'true');
                response.setHeader('Sunset', generateSunsetHeader(sunsetDate));
                const version = request.apiVersion || 'unknown';
                const warning = createDeprecationWarning(version, sunsetDate);
                response.setHeader('Warning', `299 - "${warning}"`);
            }
            return next.handle().pipe((0, operators_1.tap)(() => {
                // Track usage
                const version = request.apiVersion;
                if (version) {
                    trackVersionUsage(version, request.user?.id || 'anonymous', request.path, Date.now() - request.startTime, response.statusCode);
                }
            }));
        }
    };
    __setFunctionName(_classThis, "DeprecationInterceptor");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        DeprecationInterceptor = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return DeprecationInterceptor = _classThis;
})();
exports.DeprecationInterceptor = DeprecationInterceptor;
// ============================================================================
// NESTJS SERVICE
// ============================================================================
/**
 * Version Management Service
 */
let VersionService = (() => {
    let _classDecorators = [(0, common_1.Injectable)()];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    var VersionService = _classThis = class {
        /**
         * Get all active API versions
         */
        async getActiveVersions() {
            const versions = await APIVersionModel.findAll({
                where: { isActive: true },
                order: [['releaseDate', 'DESC']],
            });
            return versions.map((v) => ({
                version: v.version,
                status: v.status,
                releaseDate: v.releaseDate,
                deprecationDate: v.deprecationDate,
                sunsetDate: v.sunsetDate,
                retirementDate: v.retirementDate,
                description: v.description,
                changelog: v.changelog,
                breakingChanges: v.breakingChanges,
                migrationGuide: v.migrationGuide,
                documentation: v.documentation,
                supportEmail: v.supportEmail,
            }));
        }
        /**
         * Create new API version
         */
        async createVersion(versionData) {
            const validated = exports.APIVersionSchema.parse(versionData);
            const version = await APIVersionModel.create({
                version: validated.version,
                status: validated.status,
                releaseDate: validated.releaseDate,
                deprecationDate: validated.deprecationDate,
                sunsetDate: validated.sunsetDate,
                retirementDate: validated.retirementDate,
                description: validated.description,
                changelog: validated.changelog,
                breakingChanges: versionData.breakingChanges,
                migrationGuide: validated.migrationGuide,
                documentation: validated.documentation,
                supportEmail: validated.supportEmail,
                isActive: true,
            });
            return validated;
        }
        /**
         * Deprecate version
         */
        async deprecateVersion(version, policy) {
            const validated = exports.DeprecationPolicySchema.parse(policy);
            // Update version status
            await APIVersionModel.update({
                status: VersionStatus.DEPRECATED,
                deprecationDate: validated.deprecationDate,
                sunsetDate: validated.sunsetDate,
                retirementDate: validated.retirementDate,
            }, { where: { version } });
            // Create deprecation schedule
            await DeprecationScheduleModel.create({
                version: validated.version,
                deprecationDate: validated.deprecationDate,
                sunsetDate: validated.sunsetDate,
                retirementDate: validated.retirementDate,
                reason: validated.reason,
                replacementVersion: validated.replacementVersion,
                migrationPath: validated.migrationPath,
                notificationSchedule: validated.notificationSchedule,
                warningLevel: validated.warningLevel,
                autoRetire: validated.autoRetire,
                notificationsSent: [],
            });
        }
        /**
         * Get migration guide
         */
        async getMigrationGuide(fromVersion, toVersion) {
            const migration = await VersionMigrationModel.findOne({
                where: { fromVersion, toVersion },
            });
            if (!migration)
                return null;
            return {
                fromVersion: migration.fromVersion,
                toVersion: migration.toVersion,
                breakingChanges: migration.breakingChanges,
                steps: migration.steps,
                codeExamples: migration.codeExamples,
                estimatedEffort: migration.estimatedEffort,
                automationAvailable: migration.automationAvailable,
                testingChecklist: migration.testingChecklist,
            };
        }
        /**
         * Get version analytics
         */
        async getAnalytics(version, startDate, endDate) {
            return getVersionMetrics(version, startDate, endDate);
        }
    };
    __setFunctionName(_classThis, "VersionService");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        VersionService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return VersionService = _classThis;
})();
exports.VersionService = VersionService;
// ============================================================================
// NESTJS CONTROLLER
// ============================================================================
/**
 * Version Management Controller
 */
let VersionController = (() => {
    let _classDecorators = [(0, swagger_1.ApiTags)('API Versions'), (0, common_1.Controller)('api/versions')];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _instanceExtraInitializers = [];
    let _getVersions_decorators;
    let _createVersion_decorators;
    let _deprecateVersion_decorators;
    let _getMigrationGuide_decorators;
    let _getAnalytics_decorators;
    let _getDistribution_decorators;
    var VersionController = _classThis = class {
        constructor(versionService) {
            this.versionService = (__runInitializers(this, _instanceExtraInitializers), versionService);
        }
        /**
         * Get all API versions
         */
        async getVersions() {
            return this.versionService.getActiveVersions();
        }
        /**
         * Create new API version
         */
        async createVersion(versionData) {
            return this.versionService.createVersion(versionData);
        }
        /**
         * Deprecate API version
         */
        async deprecateVersion(version, policy) {
            await this.versionService.deprecateVersion(version, policy);
            return { message: `Version ${version} has been deprecated` };
        }
        /**
         * Get migration guide
         */
        async getMigrationGuide(fromVersion, toVersion) {
            const guide = await this.versionService.getMigrationGuide(fromVersion, toVersion);
            if (!guide) {
                throw new common_1.BadRequestException('Migration guide not found');
            }
            return guide;
        }
        /**
         * Get version analytics
         */
        async getAnalytics(version, startDate, endDate) {
            const start = startDate || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
            const end = endDate || new Date();
            return this.versionService.getAnalytics(version, start, end);
        }
        /**
         * Get version distribution
         */
        async getDistribution(startDate, endDate) {
            const start = startDate || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
            const end = endDate || new Date();
            return getVersionDistribution(start, end);
        }
    };
    __setFunctionName(_classThis, "VersionController");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _getVersions_decorators = [(0, common_1.Get)(), (0, common_1.HttpCode)(common_1.HttpStatus.OK), (0, swagger_1.ApiOperation)({
                summary: 'Get all API versions',
                description: 'Returns list of all active API versions with their metadata',
            }), (0, swagger_1.ApiResponse)({
                status: 200,
                description: 'List of API versions',
                schema: {
                    type: 'array',
                    items: {
                        type: 'object',
                        properties: {
                            version: { type: 'string', example: 'v1' },
                            status: { type: 'string', enum: Object.values(VersionStatus) },
                            releaseDate: { type: 'string', format: 'date-time' },
                            deprecationDate: { type: 'string', format: 'date-time', nullable: true },
                            sunsetDate: { type: 'string', format: 'date-time', nullable: true },
                        },
                    },
                },
            })];
        _createVersion_decorators = [(0, common_1.Post)(), (0, common_1.HttpCode)(common_1.HttpStatus.CREATED), (0, swagger_1.ApiOperation)({
                summary: 'Create new API version',
                description: 'Creates a new API version with metadata',
            }), (0, swagger_1.ApiResponse)({ status: 201, description: 'Version created successfully' }), (0, swagger_1.ApiResponse)({ status: 400, description: 'Invalid version data' })];
        _deprecateVersion_decorators = [(0, common_1.Post)(':version/deprecate'), (0, common_1.HttpCode)(common_1.HttpStatus.OK), (0, swagger_1.ApiOperation)({
                summary: 'Deprecate API version',
                description: 'Marks an API version as deprecated and schedules sunset',
            }), (0, swagger_1.ApiParam)({ name: 'version', description: 'Version to deprecate' }), (0, swagger_1.ApiResponse)({ status: 200, description: 'Version deprecated successfully' })];
        _getMigrationGuide_decorators = [(0, common_1.Get)('migration/:fromVersion/:toVersion'), (0, common_1.HttpCode)(common_1.HttpStatus.OK), (0, swagger_1.ApiOperation)({
                summary: 'Get migration guide',
                description: 'Returns migration guide from one version to another',
            }), (0, swagger_1.ApiParam)({ name: 'fromVersion', description: 'Source version' }), (0, swagger_1.ApiParam)({ name: 'toVersion', description: 'Target version' }), (0, swagger_1.ApiResponse)({ status: 200, description: 'Migration guide' }), (0, swagger_1.ApiResponse)({ status: 404, description: 'Migration guide not found' })];
        _getAnalytics_decorators = [(0, common_1.Get)(':version/analytics'), (0, common_1.HttpCode)(common_1.HttpStatus.OK), (0, swagger_1.ApiOperation)({
                summary: 'Get version analytics',
                description: 'Returns usage analytics for specific API version',
            }), (0, swagger_1.ApiParam)({ name: 'version', description: 'API version' }), (0, swagger_1.ApiQuery)({ name: 'startDate', required: false, type: Date }), (0, swagger_1.ApiQuery)({ name: 'endDate', required: false, type: Date }), (0, swagger_1.ApiResponse)({ status: 200, description: 'Version analytics' })];
        _getDistribution_decorators = [(0, common_1.Get)('analytics/distribution'), (0, common_1.HttpCode)(common_1.HttpStatus.OK), (0, swagger_1.ApiOperation)({
                summary: 'Get version distribution',
                description: 'Returns distribution of requests across all versions',
            }), (0, swagger_1.ApiQuery)({ name: 'startDate', required: false, type: Date }), (0, swagger_1.ApiQuery)({ name: 'endDate', required: false, type: Date }), (0, swagger_1.ApiResponse)({ status: 200, description: 'Version distribution' })];
        __esDecorate(_classThis, null, _getVersions_decorators, { kind: "method", name: "getVersions", static: false, private: false, access: { has: obj => "getVersions" in obj, get: obj => obj.getVersions }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _createVersion_decorators, { kind: "method", name: "createVersion", static: false, private: false, access: { has: obj => "createVersion" in obj, get: obj => obj.createVersion }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _deprecateVersion_decorators, { kind: "method", name: "deprecateVersion", static: false, private: false, access: { has: obj => "deprecateVersion" in obj, get: obj => obj.deprecateVersion }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getMigrationGuide_decorators, { kind: "method", name: "getMigrationGuide", static: false, private: false, access: { has: obj => "getMigrationGuide" in obj, get: obj => obj.getMigrationGuide }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getAnalytics_decorators, { kind: "method", name: "getAnalytics", static: false, private: false, access: { has: obj => "getAnalytics" in obj, get: obj => obj.getAnalytics }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getDistribution_decorators, { kind: "method", name: "getDistribution", static: false, private: false, access: { has: obj => "getDistribution" in obj, get: obj => obj.getDistribution }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        VersionController = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return VersionController = _classThis;
})();
exports.VersionController = VersionController;
//# sourceMappingURL=api-versioning-kit.prod.js.map