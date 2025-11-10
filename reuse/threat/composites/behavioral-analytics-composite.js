"use strict";
/**
 * LOC: BEHAVANALCOMP001
 * File: /reuse/threat/composites/behavioral-analytics-composite.ts
 *
 * UPSTREAM (imports from):
 *   - @nestjs/common
 *   - @nestjs/swagger
 *   - sequelize-typescript
 *   - sequelize
 *   - crypto (Node.js built-in)
 *   - ../behavioral-threat-analytics-kit
 *   - ../threat-scoring-kit
 *   - ../threat-correlation-kit
 *   - ../security-analytics-kit
 *   - ../threat-analytics-kit
 *
 * DOWNSTREAM (imported by):
 *   - User and Entity Behavior Analytics (UEBA) services
 *   - Behavioral threat detection modules
 *   - Risk scoring engines
 *   - Insider threat detection systems
 *   - Peer group analysis services
 *   - Healthcare security monitoring dashboards
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
exports.BehavioralAnalyticsService = exports.scoreBehaviorAnomalySeverity = exports.createPeerGroup = exports.calculateTrustScore = exports.detectDataExfiltration = exports.detectPrivilegeEscalation = exports.calculateActivityFrequency = exports.filterActivitiesByType = exports.generateRiskHeatmap = exports.calculateBehaviorStability = exports.detectBehaviorShift = exports.scoreBehaviorConsistency = exports.calculateBehavioralEntropy = exports.exportBehaviorData = exports.mergeBehaviorBaselines = exports.validateBehaviorBaseline = exports.determineRiskLevel = exports.normalizeRiskScores = exports.aggregateRiskScores = exports.calculateRiskConfidenceInterval = exports.generateBehaviorAnalyticsReport = exports.predictRiskScore = exports.calculateRiskTrend = exports.analyzeTemporalBehavior = exports.detectInsiderThreats = exports.calculatePeerGroupStatistics = exports.identifyPeerGroupOutliers = exports.compareToPeerGroup = exports.adaptiveBaselineLearning = exports.detectBaselineDeviation = exports.calculateBaselineMetrics = exports.updateBehaviorBaseline = exports.createBehaviorBaseline = exports.identifyBehaviorAnomalies = exports.calculateBehaviorScore = exports.compareBehaviorProfiles = exports.trackBehaviorChanges = exports.analyzeEntityBehavior = exports.analyzeUserBehavior = exports.InsiderThreatIndicatorModel = exports.PeerGroupModel = exports.BehaviorRiskScoreModel = exports.BehaviorActivityModel = exports.BehaviorEntityModel = exports.InsiderThreatType = exports.PatternType = exports.BehaviorActivityType = exports.BehaviorRiskLevel = exports.BehaviorEntityType = void 0;
/**
 * File: /reuse/threat/composites/behavioral-analytics-composite.ts
 * Locator: WC-BEHAVIORAL-ANALYTICS-COMPOSITE-001
 * Purpose: Comprehensive Behavioral Analytics Toolkit - Production-ready UEBA and behavioral threat analytics
 *
 * Upstream: Composed from behavioral-threat-analytics-kit, threat-scoring-kit, threat-correlation-kit, security-analytics-kit, threat-analytics-kit
 * Downstream: ../backend/*, UEBA services, Behavioral analytics, Insider threat detection, Risk assessment
 * Dependencies: TypeScript 5.x, Node 18+, @nestjs/common, @nestjs/swagger, sequelize-typescript, crypto
 * Exports: 45 utility functions for UEBA, behavioral scoring, peer analysis, risk assessment, temporal analysis, pattern recognition
 *
 * LLM Context: Enterprise-grade behavioral analytics toolkit for White Cross healthcare platform.
 * Provides comprehensive User and Entity Behavior Analytics (UEBA) including user behavior profiling,
 * behavioral risk scoring, peer group comparative analysis, temporal behavior pattern analysis, insider
 * threat detection, privilege escalation detection, data exfiltration analysis, abnormal access pattern
 * recognition, compromised credential detection, and HIPAA-compliant behavioral monitoring for healthcare
 * systems. Composes functions from multiple threat intelligence kits to provide unified behavioral
 * analytics operations for detecting and preventing insider threats, account compromise, and data breaches.
 */
const sequelize_typescript_1 = require("sequelize-typescript");
const swagger_1 = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const crypto = __importStar(require("crypto"));
// ============================================================================
// TYPE DEFINITIONS
// ============================================================================
/**
 * Behavioral entity types for analytics
 */
var BehaviorEntityType;
(function (BehaviorEntityType) {
    BehaviorEntityType["USER"] = "USER";
    BehaviorEntityType["SERVICE_ACCOUNT"] = "SERVICE_ACCOUNT";
    BehaviorEntityType["DEVICE"] = "DEVICE";
    BehaviorEntityType["APPLICATION"] = "APPLICATION";
    BehaviorEntityType["IP_ADDRESS"] = "IP_ADDRESS";
    BehaviorEntityType["API_KEY"] = "API_KEY";
})(BehaviorEntityType || (exports.BehaviorEntityType = BehaviorEntityType = {}));
/**
 * Risk level classification for behavioral analytics
 */
var BehaviorRiskLevel;
(function (BehaviorRiskLevel) {
    BehaviorRiskLevel["CRITICAL"] = "CRITICAL";
    BehaviorRiskLevel["HIGH"] = "HIGH";
    BehaviorRiskLevel["MEDIUM"] = "MEDIUM";
    BehaviorRiskLevel["LOW"] = "LOW";
    BehaviorRiskLevel["MINIMAL"] = "MINIMAL";
})(BehaviorRiskLevel || (exports.BehaviorRiskLevel = BehaviorRiskLevel = {}));
/**
 * Activity types for behavioral tracking
 */
var BehaviorActivityType;
(function (BehaviorActivityType) {
    BehaviorActivityType["LOGIN"] = "LOGIN";
    BehaviorActivityType["LOGOUT"] = "LOGOUT";
    BehaviorActivityType["FILE_ACCESS"] = "FILE_ACCESS";
    BehaviorActivityType["FILE_DOWNLOAD"] = "FILE_DOWNLOAD";
    BehaviorActivityType["FILE_UPLOAD"] = "FILE_UPLOAD";
    BehaviorActivityType["FILE_DELETE"] = "FILE_DELETE";
    BehaviorActivityType["DATA_QUERY"] = "DATA_QUERY";
    BehaviorActivityType["DATA_EXPORT"] = "DATA_EXPORT";
    BehaviorActivityType["PRIVILEGE_ESCALATION"] = "PRIVILEGE_ESCALATION";
    BehaviorActivityType["CONFIGURATION_CHANGE"] = "CONFIGURATION_CHANGE";
    BehaviorActivityType["API_CALL"] = "API_CALL";
    BehaviorActivityType["EMAIL_SENT"] = "EMAIL_SENT";
    BehaviorActivityType["FAILED_LOGIN"] = "FAILED_LOGIN";
    BehaviorActivityType["PASSWORD_CHANGE"] = "PASSWORD_CHANGE";
    BehaviorActivityType["PERMISSION_CHANGE"] = "PERMISSION_CHANGE";
})(BehaviorActivityType || (exports.BehaviorActivityType = BehaviorActivityType = {}));
/**
 * Pattern types
 */
var PatternType;
(function (PatternType) {
    PatternType["TEMPORAL"] = "TEMPORAL";
    PatternType["SEQUENTIAL"] = "SEQUENTIAL";
    PatternType["VOLUMETRIC"] = "VOLUMETRIC";
    PatternType["ACCESS"] = "ACCESS";
    PatternType["LOCATION"] = "LOCATION";
    PatternType["DEVICE"] = "DEVICE";
    PatternType["DATA_FLOW"] = "DATA_FLOW";
})(PatternType || (exports.PatternType = PatternType = {}));
/**
 * Insider threat types
 */
var InsiderThreatType;
(function (InsiderThreatType) {
    InsiderThreatType["DATA_EXFILTRATION"] = "DATA_EXFILTRATION";
    InsiderThreatType["PRIVILEGE_ABUSE"] = "PRIVILEGE_ABUSE";
    InsiderThreatType["CREDENTIAL_THEFT"] = "CREDENTIAL_THEFT";
    InsiderThreatType["SABOTAGE"] = "SABOTAGE";
    InsiderThreatType["POLICY_VIOLATION"] = "POLICY_VIOLATION";
    InsiderThreatType["SUSPICIOUS_COLLABORATION"] = "SUSPICIOUS_COLLABORATION";
    InsiderThreatType["ANOMALOUS_ACCESS"] = "ANOMALOUS_ACCESS";
})(InsiderThreatType || (exports.InsiderThreatType = InsiderThreatType = {}));
// ============================================================================
// SEQUELIZE MODELS
// ============================================================================
/**
 * Behavior Entity Model
 * Stores entities being monitored for behavioral analytics
 */
let BehaviorEntityModel = (() => {
    let _classDecorators = [(0, sequelize_typescript_1.Table)({
            tableName: 'behavior_entities',
            timestamps: true,
            indexes: [
                { fields: ['identifier'], unique: true },
                { fields: ['type'] },
                { fields: ['riskLevel'] },
                { fields: ['riskScore'] },
            ],
        })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = sequelize_typescript_1.Model;
    let _id_decorators;
    let _id_initializers = [];
    let _id_extraInitializers = [];
    let _type_decorators;
    let _type_initializers = [];
    let _type_extraInitializers = [];
    let _identifier_decorators;
    let _identifier_initializers = [];
    let _identifier_extraInitializers = [];
    let _department_decorators;
    let _department_initializers = [];
    let _department_extraInitializers = [];
    let _role_decorators;
    let _role_initializers = [];
    let _role_extraInitializers = [];
    let _riskLevel_decorators;
    let _riskLevel_initializers = [];
    let _riskLevel_extraInitializers = [];
    let _riskScore_decorators;
    let _riskScore_initializers = [];
    let _riskScore_extraInitializers = [];
    let _trustScore_decorators;
    let _trustScore_initializers = [];
    let _trustScore_extraInitializers = [];
    let _metadata_decorators;
    let _metadata_initializers = [];
    let _metadata_extraInitializers = [];
    var BehaviorEntityModel = _classThis = class extends _classSuper {
        constructor() {
            super(...arguments);
            this.id = __runInitializers(this, _id_initializers, void 0);
            this.type = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _type_initializers, void 0));
            this.identifier = (__runInitializers(this, _type_extraInitializers), __runInitializers(this, _identifier_initializers, void 0));
            this.department = (__runInitializers(this, _identifier_extraInitializers), __runInitializers(this, _department_initializers, void 0));
            this.role = (__runInitializers(this, _department_extraInitializers), __runInitializers(this, _role_initializers, void 0));
            this.riskLevel = (__runInitializers(this, _role_extraInitializers), __runInitializers(this, _riskLevel_initializers, void 0));
            this.riskScore = (__runInitializers(this, _riskLevel_extraInitializers), __runInitializers(this, _riskScore_initializers, void 0));
            this.trustScore = (__runInitializers(this, _riskScore_extraInitializers), __runInitializers(this, _trustScore_initializers, void 0));
            this.metadata = (__runInitializers(this, _trustScore_extraInitializers), __runInitializers(this, _metadata_initializers, void 0));
            __runInitializers(this, _metadata_extraInitializers);
        }
    };
    __setFunctionName(_classThis, "BehaviorEntityModel");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        _id_decorators = [sequelize_typescript_1.PrimaryKey, (0, sequelize_typescript_1.Default)(sequelize_typescript_1.DataType.UUIDV4), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.UUID), (0, swagger_1.ApiProperty)({ description: 'Unique entity identifier' })];
        _type_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.ENUM(...Object.values(BehaviorEntityType))), (0, swagger_1.ApiProperty)({ enum: BehaviorEntityType, description: 'Entity type' })];
        _identifier_decorators = [(0, sequelize_typescript_1.AllowNull)(false), sequelize_typescript_1.Unique, (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING), (0, swagger_1.ApiProperty)({ description: 'Entity identifier (username, device ID, etc.)' })];
        _department_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING), (0, swagger_1.ApiPropertyOptional)({ description: 'Department or organizational unit' })];
        _role_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING), (0, swagger_1.ApiPropertyOptional)({ description: 'Role or job function' })];
        _riskLevel_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Default)(BehaviorRiskLevel.LOW), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.ENUM(...Object.values(BehaviorRiskLevel))), (0, swagger_1.ApiProperty)({ enum: BehaviorRiskLevel, description: 'Current risk level' })];
        _riskScore_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Default)(0), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DECIMAL(5, 2)), (0, swagger_1.ApiProperty)({ description: 'Risk score (0-100)' })];
        _trustScore_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Default)(50), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DECIMAL(5, 2)), (0, swagger_1.ApiProperty)({ description: 'Trust score (0-100)' })];
        _metadata_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.JSONB), (0, swagger_1.ApiPropertyOptional)({ description: 'Additional metadata' })];
        __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: obj => "id" in obj, get: obj => obj.id, set: (obj, value) => { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
        __esDecorate(null, null, _type_decorators, { kind: "field", name: "type", static: false, private: false, access: { has: obj => "type" in obj, get: obj => obj.type, set: (obj, value) => { obj.type = value; } }, metadata: _metadata }, _type_initializers, _type_extraInitializers);
        __esDecorate(null, null, _identifier_decorators, { kind: "field", name: "identifier", static: false, private: false, access: { has: obj => "identifier" in obj, get: obj => obj.identifier, set: (obj, value) => { obj.identifier = value; } }, metadata: _metadata }, _identifier_initializers, _identifier_extraInitializers);
        __esDecorate(null, null, _department_decorators, { kind: "field", name: "department", static: false, private: false, access: { has: obj => "department" in obj, get: obj => obj.department, set: (obj, value) => { obj.department = value; } }, metadata: _metadata }, _department_initializers, _department_extraInitializers);
        __esDecorate(null, null, _role_decorators, { kind: "field", name: "role", static: false, private: false, access: { has: obj => "role" in obj, get: obj => obj.role, set: (obj, value) => { obj.role = value; } }, metadata: _metadata }, _role_initializers, _role_extraInitializers);
        __esDecorate(null, null, _riskLevel_decorators, { kind: "field", name: "riskLevel", static: false, private: false, access: { has: obj => "riskLevel" in obj, get: obj => obj.riskLevel, set: (obj, value) => { obj.riskLevel = value; } }, metadata: _metadata }, _riskLevel_initializers, _riskLevel_extraInitializers);
        __esDecorate(null, null, _riskScore_decorators, { kind: "field", name: "riskScore", static: false, private: false, access: { has: obj => "riskScore" in obj, get: obj => obj.riskScore, set: (obj, value) => { obj.riskScore = value; } }, metadata: _metadata }, _riskScore_initializers, _riskScore_extraInitializers);
        __esDecorate(null, null, _trustScore_decorators, { kind: "field", name: "trustScore", static: false, private: false, access: { has: obj => "trustScore" in obj, get: obj => obj.trustScore, set: (obj, value) => { obj.trustScore = value; } }, metadata: _metadata }, _trustScore_initializers, _trustScore_extraInitializers);
        __esDecorate(null, null, _metadata_decorators, { kind: "field", name: "metadata", static: false, private: false, access: { has: obj => "metadata" in obj, get: obj => obj.metadata, set: (obj, value) => { obj.metadata = value; } }, metadata: _metadata }, _metadata_initializers, _metadata_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        BehaviorEntityModel = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return BehaviorEntityModel = _classThis;
})();
exports.BehaviorEntityModel = BehaviorEntityModel;
/**
 * Behavior Activity Model
 * Stores individual behavioral activities
 */
let BehaviorActivityModel = (() => {
    let _classDecorators = [(0, sequelize_typescript_1.Table)({
            tableName: 'behavior_activities',
            timestamps: true,
            indexes: [
                { fields: ['entityId'] },
                { fields: ['activityType'] },
                { fields: ['timestamp'] },
                { fields: ['riskScore'] },
            ],
        })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = sequelize_typescript_1.Model;
    let _id_decorators;
    let _id_initializers = [];
    let _id_extraInitializers = [];
    let _entityId_decorators;
    let _entityId_initializers = [];
    let _entityId_extraInitializers = [];
    let _activityType_decorators;
    let _activityType_initializers = [];
    let _activityType_extraInitializers = [];
    let _timestamp_decorators;
    let _timestamp_initializers = [];
    let _timestamp_extraInitializers = [];
    let _details_decorators;
    let _details_initializers = [];
    let _details_extraInitializers = [];
    let _location_decorators;
    let _location_initializers = [];
    let _location_extraInitializers = [];
    let _device_decorators;
    let _device_initializers = [];
    let _device_extraInitializers = [];
    let _contextual_decorators;
    let _contextual_initializers = [];
    let _contextual_extraInitializers = [];
    let _riskScore_decorators;
    let _riskScore_initializers = [];
    let _riskScore_extraInitializers = [];
    let _metadata_decorators;
    let _metadata_initializers = [];
    let _metadata_extraInitializers = [];
    var BehaviorActivityModel = _classThis = class extends _classSuper {
        constructor() {
            super(...arguments);
            this.id = __runInitializers(this, _id_initializers, void 0);
            this.entityId = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _entityId_initializers, void 0));
            this.activityType = (__runInitializers(this, _entityId_extraInitializers), __runInitializers(this, _activityType_initializers, void 0));
            this.timestamp = (__runInitializers(this, _activityType_extraInitializers), __runInitializers(this, _timestamp_initializers, void 0));
            this.details = (__runInitializers(this, _timestamp_extraInitializers), __runInitializers(this, _details_initializers, void 0));
            this.location = (__runInitializers(this, _details_extraInitializers), __runInitializers(this, _location_initializers, void 0));
            this.device = (__runInitializers(this, _location_extraInitializers), __runInitializers(this, _device_initializers, void 0));
            this.contextual = (__runInitializers(this, _device_extraInitializers), __runInitializers(this, _contextual_initializers, void 0));
            this.riskScore = (__runInitializers(this, _contextual_extraInitializers), __runInitializers(this, _riskScore_initializers, void 0));
            this.metadata = (__runInitializers(this, _riskScore_extraInitializers), __runInitializers(this, _metadata_initializers, void 0));
            __runInitializers(this, _metadata_extraInitializers);
        }
    };
    __setFunctionName(_classThis, "BehaviorActivityModel");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        _id_decorators = [sequelize_typescript_1.PrimaryKey, (0, sequelize_typescript_1.Default)(sequelize_typescript_1.DataType.UUIDV4), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.UUID), (0, swagger_1.ApiProperty)({ description: 'Unique activity identifier' })];
        _entityId_decorators = [(0, sequelize_typescript_1.AllowNull)(false), sequelize_typescript_1.Index, (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.UUID), (0, swagger_1.ApiProperty)({ description: 'Associated entity ID' })];
        _activityType_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.ENUM(...Object.values(BehaviorActivityType))), (0, swagger_1.ApiProperty)({ enum: BehaviorActivityType, description: 'Activity type' })];
        _timestamp_decorators = [(0, sequelize_typescript_1.AllowNull)(false), sequelize_typescript_1.Index, (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DATE), (0, swagger_1.ApiProperty)({ description: 'Activity timestamp' })];
        _details_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.JSONB), (0, swagger_1.ApiProperty)({ description: 'Activity details' })];
        _location_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.JSONB), (0, swagger_1.ApiPropertyOptional)({ description: 'Geographic location' })];
        _device_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.JSONB), (0, swagger_1.ApiPropertyOptional)({ description: 'Device information' })];
        _contextual_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.JSONB), (0, swagger_1.ApiPropertyOptional)({ description: 'Contextual data' })];
        _riskScore_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DECIMAL(5, 2)), (0, swagger_1.ApiPropertyOptional)({ description: 'Activity risk score' })];
        _metadata_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.JSONB), (0, swagger_1.ApiPropertyOptional)({ description: 'Additional metadata' })];
        __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: obj => "id" in obj, get: obj => obj.id, set: (obj, value) => { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
        __esDecorate(null, null, _entityId_decorators, { kind: "field", name: "entityId", static: false, private: false, access: { has: obj => "entityId" in obj, get: obj => obj.entityId, set: (obj, value) => { obj.entityId = value; } }, metadata: _metadata }, _entityId_initializers, _entityId_extraInitializers);
        __esDecorate(null, null, _activityType_decorators, { kind: "field", name: "activityType", static: false, private: false, access: { has: obj => "activityType" in obj, get: obj => obj.activityType, set: (obj, value) => { obj.activityType = value; } }, metadata: _metadata }, _activityType_initializers, _activityType_extraInitializers);
        __esDecorate(null, null, _timestamp_decorators, { kind: "field", name: "timestamp", static: false, private: false, access: { has: obj => "timestamp" in obj, get: obj => obj.timestamp, set: (obj, value) => { obj.timestamp = value; } }, metadata: _metadata }, _timestamp_initializers, _timestamp_extraInitializers);
        __esDecorate(null, null, _details_decorators, { kind: "field", name: "details", static: false, private: false, access: { has: obj => "details" in obj, get: obj => obj.details, set: (obj, value) => { obj.details = value; } }, metadata: _metadata }, _details_initializers, _details_extraInitializers);
        __esDecorate(null, null, _location_decorators, { kind: "field", name: "location", static: false, private: false, access: { has: obj => "location" in obj, get: obj => obj.location, set: (obj, value) => { obj.location = value; } }, metadata: _metadata }, _location_initializers, _location_extraInitializers);
        __esDecorate(null, null, _device_decorators, { kind: "field", name: "device", static: false, private: false, access: { has: obj => "device" in obj, get: obj => obj.device, set: (obj, value) => { obj.device = value; } }, metadata: _metadata }, _device_initializers, _device_extraInitializers);
        __esDecorate(null, null, _contextual_decorators, { kind: "field", name: "contextual", static: false, private: false, access: { has: obj => "contextual" in obj, get: obj => obj.contextual, set: (obj, value) => { obj.contextual = value; } }, metadata: _metadata }, _contextual_initializers, _contextual_extraInitializers);
        __esDecorate(null, null, _riskScore_decorators, { kind: "field", name: "riskScore", static: false, private: false, access: { has: obj => "riskScore" in obj, get: obj => obj.riskScore, set: (obj, value) => { obj.riskScore = value; } }, metadata: _metadata }, _riskScore_initializers, _riskScore_extraInitializers);
        __esDecorate(null, null, _metadata_decorators, { kind: "field", name: "metadata", static: false, private: false, access: { has: obj => "metadata" in obj, get: obj => obj.metadata, set: (obj, value) => { obj.metadata = value; } }, metadata: _metadata }, _metadata_initializers, _metadata_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        BehaviorActivityModel = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return BehaviorActivityModel = _classThis;
})();
exports.BehaviorActivityModel = BehaviorActivityModel;
/**
 * Behavior Risk Score Model
 * Stores calculated risk scores
 */
let BehaviorRiskScoreModel = (() => {
    let _classDecorators = [(0, sequelize_typescript_1.Table)({
            tableName: 'behavior_risk_scores',
            timestamps: true,
            indexes: [
                { fields: ['entityId'] },
                { fields: ['timestamp'] },
                { fields: ['overallScore'] },
            ],
        })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = sequelize_typescript_1.Model;
    let _id_decorators;
    let _id_initializers = [];
    let _id_extraInitializers = [];
    let _entityId_decorators;
    let _entityId_initializers = [];
    let _entityId_extraInitializers = [];
    let _timestamp_decorators;
    let _timestamp_initializers = [];
    let _timestamp_extraInitializers = [];
    let _overallScore_decorators;
    let _overallScore_initializers = [];
    let _overallScore_extraInitializers = [];
    let _components_decorators;
    let _components_initializers = [];
    let _components_extraInitializers = [];
    let _factors_decorators;
    let _factors_initializers = [];
    let _factors_extraInitializers = [];
    let _trend_decorators;
    let _trend_initializers = [];
    let _trend_extraInitializers = [];
    let _confidence_decorators;
    let _confidence_initializers = [];
    let _confidence_extraInitializers = [];
    let _explanation_decorators;
    let _explanation_initializers = [];
    let _explanation_extraInitializers = [];
    let _recommendedActions_decorators;
    let _recommendedActions_initializers = [];
    let _recommendedActions_extraInitializers = [];
    var BehaviorRiskScoreModel = _classThis = class extends _classSuper {
        constructor() {
            super(...arguments);
            this.id = __runInitializers(this, _id_initializers, void 0);
            this.entityId = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _entityId_initializers, void 0));
            this.timestamp = (__runInitializers(this, _entityId_extraInitializers), __runInitializers(this, _timestamp_initializers, void 0));
            this.overallScore = (__runInitializers(this, _timestamp_extraInitializers), __runInitializers(this, _overallScore_initializers, void 0));
            this.components = (__runInitializers(this, _overallScore_extraInitializers), __runInitializers(this, _components_initializers, void 0));
            this.factors = (__runInitializers(this, _components_extraInitializers), __runInitializers(this, _factors_initializers, void 0));
            this.trend = (__runInitializers(this, _factors_extraInitializers), __runInitializers(this, _trend_initializers, void 0));
            this.confidence = (__runInitializers(this, _trend_extraInitializers), __runInitializers(this, _confidence_initializers, void 0));
            this.explanation = (__runInitializers(this, _confidence_extraInitializers), __runInitializers(this, _explanation_initializers, void 0));
            this.recommendedActions = (__runInitializers(this, _explanation_extraInitializers), __runInitializers(this, _recommendedActions_initializers, void 0));
            __runInitializers(this, _recommendedActions_extraInitializers);
        }
    };
    __setFunctionName(_classThis, "BehaviorRiskScoreModel");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        _id_decorators = [sequelize_typescript_1.PrimaryKey, (0, sequelize_typescript_1.Default)(sequelize_typescript_1.DataType.UUIDV4), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.UUID), (0, swagger_1.ApiProperty)({ description: 'Unique risk score identifier' })];
        _entityId_decorators = [(0, sequelize_typescript_1.AllowNull)(false), sequelize_typescript_1.Index, (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.UUID), (0, swagger_1.ApiProperty)({ description: 'Associated entity ID' })];
        _timestamp_decorators = [(0, sequelize_typescript_1.AllowNull)(false), sequelize_typescript_1.Index, (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DATE), (0, swagger_1.ApiProperty)({ description: 'Score calculation timestamp' })];
        _overallScore_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DECIMAL(5, 2)), (0, swagger_1.ApiProperty)({ description: 'Overall risk score (0-100)' })];
        _components_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.JSONB), (0, swagger_1.ApiProperty)({ description: 'Risk score components' })];
        _factors_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.JSONB), (0, swagger_1.ApiProperty)({ description: 'Risk factors' })];
        _trend_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.JSONB), (0, swagger_1.ApiProperty)({ description: 'Risk trend analysis' })];
        _confidence_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DECIMAL(5, 2)), (0, swagger_1.ApiProperty)({ description: 'Confidence in score (0-100)' })];
        _explanation_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.TEXT), (0, swagger_1.ApiProperty)({ description: 'Human-readable explanation' })];
        _recommendedActions_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.ARRAY(sequelize_typescript_1.DataType.TEXT)), (0, swagger_1.ApiProperty)({ description: 'Recommended actions' })];
        __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: obj => "id" in obj, get: obj => obj.id, set: (obj, value) => { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
        __esDecorate(null, null, _entityId_decorators, { kind: "field", name: "entityId", static: false, private: false, access: { has: obj => "entityId" in obj, get: obj => obj.entityId, set: (obj, value) => { obj.entityId = value; } }, metadata: _metadata }, _entityId_initializers, _entityId_extraInitializers);
        __esDecorate(null, null, _timestamp_decorators, { kind: "field", name: "timestamp", static: false, private: false, access: { has: obj => "timestamp" in obj, get: obj => obj.timestamp, set: (obj, value) => { obj.timestamp = value; } }, metadata: _metadata }, _timestamp_initializers, _timestamp_extraInitializers);
        __esDecorate(null, null, _overallScore_decorators, { kind: "field", name: "overallScore", static: false, private: false, access: { has: obj => "overallScore" in obj, get: obj => obj.overallScore, set: (obj, value) => { obj.overallScore = value; } }, metadata: _metadata }, _overallScore_initializers, _overallScore_extraInitializers);
        __esDecorate(null, null, _components_decorators, { kind: "field", name: "components", static: false, private: false, access: { has: obj => "components" in obj, get: obj => obj.components, set: (obj, value) => { obj.components = value; } }, metadata: _metadata }, _components_initializers, _components_extraInitializers);
        __esDecorate(null, null, _factors_decorators, { kind: "field", name: "factors", static: false, private: false, access: { has: obj => "factors" in obj, get: obj => obj.factors, set: (obj, value) => { obj.factors = value; } }, metadata: _metadata }, _factors_initializers, _factors_extraInitializers);
        __esDecorate(null, null, _trend_decorators, { kind: "field", name: "trend", static: false, private: false, access: { has: obj => "trend" in obj, get: obj => obj.trend, set: (obj, value) => { obj.trend = value; } }, metadata: _metadata }, _trend_initializers, _trend_extraInitializers);
        __esDecorate(null, null, _confidence_decorators, { kind: "field", name: "confidence", static: false, private: false, access: { has: obj => "confidence" in obj, get: obj => obj.confidence, set: (obj, value) => { obj.confidence = value; } }, metadata: _metadata }, _confidence_initializers, _confidence_extraInitializers);
        __esDecorate(null, null, _explanation_decorators, { kind: "field", name: "explanation", static: false, private: false, access: { has: obj => "explanation" in obj, get: obj => obj.explanation, set: (obj, value) => { obj.explanation = value; } }, metadata: _metadata }, _explanation_initializers, _explanation_extraInitializers);
        __esDecorate(null, null, _recommendedActions_decorators, { kind: "field", name: "recommendedActions", static: false, private: false, access: { has: obj => "recommendedActions" in obj, get: obj => obj.recommendedActions, set: (obj, value) => { obj.recommendedActions = value; } }, metadata: _metadata }, _recommendedActions_initializers, _recommendedActions_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        BehaviorRiskScoreModel = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return BehaviorRiskScoreModel = _classThis;
})();
exports.BehaviorRiskScoreModel = BehaviorRiskScoreModel;
/**
 * Peer Group Model
 * Stores peer group definitions for comparative analysis
 */
let PeerGroupModel = (() => {
    let _classDecorators = [(0, sequelize_typescript_1.Table)({
            tableName: 'peer_groups',
            timestamps: true,
            indexes: [{ fields: ['name'] }],
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
    let _criteria_decorators;
    let _criteria_initializers = [];
    let _criteria_extraInitializers = [];
    let _members_decorators;
    let _members_initializers = [];
    let _members_extraInitializers = [];
    let _baseline_decorators;
    let _baseline_initializers = [];
    let _baseline_extraInitializers = [];
    let _statistics_decorators;
    let _statistics_initializers = [];
    let _statistics_extraInitializers = [];
    var PeerGroupModel = _classThis = class extends _classSuper {
        constructor() {
            super(...arguments);
            this.id = __runInitializers(this, _id_initializers, void 0);
            this.name = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _name_initializers, void 0));
            this.description = (__runInitializers(this, _name_extraInitializers), __runInitializers(this, _description_initializers, void 0));
            this.criteria = (__runInitializers(this, _description_extraInitializers), __runInitializers(this, _criteria_initializers, void 0));
            this.members = (__runInitializers(this, _criteria_extraInitializers), __runInitializers(this, _members_initializers, void 0));
            this.baseline = (__runInitializers(this, _members_extraInitializers), __runInitializers(this, _baseline_initializers, void 0));
            this.statistics = (__runInitializers(this, _baseline_extraInitializers), __runInitializers(this, _statistics_initializers, void 0));
            __runInitializers(this, _statistics_extraInitializers);
        }
    };
    __setFunctionName(_classThis, "PeerGroupModel");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        _id_decorators = [sequelize_typescript_1.PrimaryKey, (0, sequelize_typescript_1.Default)(sequelize_typescript_1.DataType.UUIDV4), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.UUID), (0, swagger_1.ApiProperty)({ description: 'Unique peer group identifier' })];
        _name_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING), (0, swagger_1.ApiProperty)({ description: 'Peer group name' })];
        _description_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.TEXT), (0, swagger_1.ApiProperty)({ description: 'Peer group description' })];
        _criteria_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.JSONB), (0, swagger_1.ApiProperty)({ description: 'Membership criteria' })];
        _members_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.ARRAY(sequelize_typescript_1.DataType.UUID)), (0, swagger_1.ApiProperty)({ description: 'Member entity IDs' })];
        _baseline_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.JSONB), (0, swagger_1.ApiProperty)({ description: 'Group behavioral baseline' })];
        _statistics_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.JSONB), (0, swagger_1.ApiProperty)({ description: 'Group statistics' })];
        __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: obj => "id" in obj, get: obj => obj.id, set: (obj, value) => { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
        __esDecorate(null, null, _name_decorators, { kind: "field", name: "name", static: false, private: false, access: { has: obj => "name" in obj, get: obj => obj.name, set: (obj, value) => { obj.name = value; } }, metadata: _metadata }, _name_initializers, _name_extraInitializers);
        __esDecorate(null, null, _description_decorators, { kind: "field", name: "description", static: false, private: false, access: { has: obj => "description" in obj, get: obj => obj.description, set: (obj, value) => { obj.description = value; } }, metadata: _metadata }, _description_initializers, _description_extraInitializers);
        __esDecorate(null, null, _criteria_decorators, { kind: "field", name: "criteria", static: false, private: false, access: { has: obj => "criteria" in obj, get: obj => obj.criteria, set: (obj, value) => { obj.criteria = value; } }, metadata: _metadata }, _criteria_initializers, _criteria_extraInitializers);
        __esDecorate(null, null, _members_decorators, { kind: "field", name: "members", static: false, private: false, access: { has: obj => "members" in obj, get: obj => obj.members, set: (obj, value) => { obj.members = value; } }, metadata: _metadata }, _members_initializers, _members_extraInitializers);
        __esDecorate(null, null, _baseline_decorators, { kind: "field", name: "baseline", static: false, private: false, access: { has: obj => "baseline" in obj, get: obj => obj.baseline, set: (obj, value) => { obj.baseline = value; } }, metadata: _metadata }, _baseline_initializers, _baseline_extraInitializers);
        __esDecorate(null, null, _statistics_decorators, { kind: "field", name: "statistics", static: false, private: false, access: { has: obj => "statistics" in obj, get: obj => obj.statistics, set: (obj, value) => { obj.statistics = value; } }, metadata: _metadata }, _statistics_initializers, _statistics_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        PeerGroupModel = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return PeerGroupModel = _classThis;
})();
exports.PeerGroupModel = PeerGroupModel;
/**
 * Insider Threat Indicator Model
 * Stores detected insider threat indicators
 */
let InsiderThreatIndicatorModel = (() => {
    let _classDecorators = [(0, sequelize_typescript_1.Table)({
            tableName: 'insider_threat_indicators',
            timestamps: true,
            indexes: [
                { fields: ['entityId'] },
                { fields: ['indicatorType'] },
                { fields: ['severity'] },
                { fields: ['detectedAt'] },
            ],
        })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = sequelize_typescript_1.Model;
    let _id_decorators;
    let _id_initializers = [];
    let _id_extraInitializers = [];
    let _entityId_decorators;
    let _entityId_initializers = [];
    let _entityId_extraInitializers = [];
    let _indicatorType_decorators;
    let _indicatorType_initializers = [];
    let _indicatorType_extraInitializers = [];
    let _severity_decorators;
    let _severity_initializers = [];
    let _severity_extraInitializers = [];
    let _confidence_decorators;
    let _confidence_initializers = [];
    let _confidence_extraInitializers = [];
    let _evidence_decorators;
    let _evidence_initializers = [];
    let _evidence_extraInitializers = [];
    let _detectedAt_decorators;
    let _detectedAt_initializers = [];
    let _detectedAt_extraInitializers = [];
    let _description_decorators;
    let _description_initializers = [];
    let _description_extraInitializers = [];
    let _recommendedActions_decorators;
    let _recommendedActions_initializers = [];
    let _recommendedActions_extraInitializers = [];
    var InsiderThreatIndicatorModel = _classThis = class extends _classSuper {
        constructor() {
            super(...arguments);
            this.id = __runInitializers(this, _id_initializers, void 0);
            this.entityId = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _entityId_initializers, void 0));
            this.indicatorType = (__runInitializers(this, _entityId_extraInitializers), __runInitializers(this, _indicatorType_initializers, void 0));
            this.severity = (__runInitializers(this, _indicatorType_extraInitializers), __runInitializers(this, _severity_initializers, void 0));
            this.confidence = (__runInitializers(this, _severity_extraInitializers), __runInitializers(this, _confidence_initializers, void 0));
            this.evidence = (__runInitializers(this, _confidence_extraInitializers), __runInitializers(this, _evidence_initializers, void 0));
            this.detectedAt = (__runInitializers(this, _evidence_extraInitializers), __runInitializers(this, _detectedAt_initializers, void 0));
            this.description = (__runInitializers(this, _detectedAt_extraInitializers), __runInitializers(this, _description_initializers, void 0));
            this.recommendedActions = (__runInitializers(this, _description_extraInitializers), __runInitializers(this, _recommendedActions_initializers, void 0));
            __runInitializers(this, _recommendedActions_extraInitializers);
        }
    };
    __setFunctionName(_classThis, "InsiderThreatIndicatorModel");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        _id_decorators = [sequelize_typescript_1.PrimaryKey, (0, sequelize_typescript_1.Default)(sequelize_typescript_1.DataType.UUIDV4), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.UUID), (0, swagger_1.ApiProperty)({ description: 'Unique indicator identifier' })];
        _entityId_decorators = [(0, sequelize_typescript_1.AllowNull)(false), sequelize_typescript_1.Index, (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.UUID), (0, swagger_1.ApiProperty)({ description: 'Associated entity ID' })];
        _indicatorType_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.ENUM(...Object.values(InsiderThreatType))), (0, swagger_1.ApiProperty)({ enum: InsiderThreatType, description: 'Threat indicator type' })];
        _severity_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.ENUM(...Object.values(BehaviorRiskLevel))), (0, swagger_1.ApiProperty)({ enum: BehaviorRiskLevel, description: 'Threat severity' })];
        _confidence_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DECIMAL(5, 2)), (0, swagger_1.ApiProperty)({ description: 'Confidence in detection (0-100)' })];
        _evidence_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.JSONB), (0, swagger_1.ApiProperty)({ description: 'Supporting evidence' })];
        _detectedAt_decorators = [(0, sequelize_typescript_1.AllowNull)(false), sequelize_typescript_1.Index, (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DATE), (0, swagger_1.ApiProperty)({ description: 'Detection timestamp' })];
        _description_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.TEXT), (0, swagger_1.ApiProperty)({ description: 'Indicator description' })];
        _recommendedActions_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.ARRAY(sequelize_typescript_1.DataType.TEXT)), (0, swagger_1.ApiProperty)({ description: 'Recommended actions' })];
        __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: obj => "id" in obj, get: obj => obj.id, set: (obj, value) => { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
        __esDecorate(null, null, _entityId_decorators, { kind: "field", name: "entityId", static: false, private: false, access: { has: obj => "entityId" in obj, get: obj => obj.entityId, set: (obj, value) => { obj.entityId = value; } }, metadata: _metadata }, _entityId_initializers, _entityId_extraInitializers);
        __esDecorate(null, null, _indicatorType_decorators, { kind: "field", name: "indicatorType", static: false, private: false, access: { has: obj => "indicatorType" in obj, get: obj => obj.indicatorType, set: (obj, value) => { obj.indicatorType = value; } }, metadata: _metadata }, _indicatorType_initializers, _indicatorType_extraInitializers);
        __esDecorate(null, null, _severity_decorators, { kind: "field", name: "severity", static: false, private: false, access: { has: obj => "severity" in obj, get: obj => obj.severity, set: (obj, value) => { obj.severity = value; } }, metadata: _metadata }, _severity_initializers, _severity_extraInitializers);
        __esDecorate(null, null, _confidence_decorators, { kind: "field", name: "confidence", static: false, private: false, access: { has: obj => "confidence" in obj, get: obj => obj.confidence, set: (obj, value) => { obj.confidence = value; } }, metadata: _metadata }, _confidence_initializers, _confidence_extraInitializers);
        __esDecorate(null, null, _evidence_decorators, { kind: "field", name: "evidence", static: false, private: false, access: { has: obj => "evidence" in obj, get: obj => obj.evidence, set: (obj, value) => { obj.evidence = value; } }, metadata: _metadata }, _evidence_initializers, _evidence_extraInitializers);
        __esDecorate(null, null, _detectedAt_decorators, { kind: "field", name: "detectedAt", static: false, private: false, access: { has: obj => "detectedAt" in obj, get: obj => obj.detectedAt, set: (obj, value) => { obj.detectedAt = value; } }, metadata: _metadata }, _detectedAt_initializers, _detectedAt_extraInitializers);
        __esDecorate(null, null, _description_decorators, { kind: "field", name: "description", static: false, private: false, access: { has: obj => "description" in obj, get: obj => obj.description, set: (obj, value) => { obj.description = value; } }, metadata: _metadata }, _description_initializers, _description_extraInitializers);
        __esDecorate(null, null, _recommendedActions_decorators, { kind: "field", name: "recommendedActions", static: false, private: false, access: { has: obj => "recommendedActions" in obj, get: obj => obj.recommendedActions, set: (obj, value) => { obj.recommendedActions = value; } }, metadata: _metadata }, _recommendedActions_initializers, _recommendedActions_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        InsiderThreatIndicatorModel = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return InsiderThreatIndicatorModel = _classThis;
})();
exports.InsiderThreatIndicatorModel = InsiderThreatIndicatorModel;
// ============================================================================
// BEHAVIORAL ANALYTICS FUNCTIONS
// ============================================================================
/**
 * Analyzes user behavior and calculates comprehensive behavioral profile.
 *
 * @param {string} userId - User identifier
 * @param {BehaviorActivity[]} activities - Recent user activities
 * @param {BehaviorBaseline} baseline - User's behavioral baseline
 * @returns {Promise<BehaviorRiskScore>} Behavioral risk assessment
 *
 * @example
 * ```typescript
 * const riskScore = await analyzeUserBehavior('user123', activities, baseline);
 * console.log('Risk level:', riskScore.overallScore);
 * ```
 */
const analyzeUserBehavior = async (userId, activities, baseline) => {
    const components = {
        activityPattern: calculateActivityPatternRisk(activities, baseline),
        accessPattern: calculateAccessPatternRisk(activities, baseline),
        volumeAnomaly: calculateVolumeAnomalyRisk(activities, baseline),
        temporalAnomaly: calculateTemporalAnomalyRisk(activities, baseline),
        locationAnomaly: calculateLocationAnomalyRisk(activities, baseline),
        peerDeviation: 0, // Requires peer group data
        privilegeRisk: calculatePrivilegeRisk(activities),
        dataAccessRisk: calculateDataAccessRisk(activities),
    };
    const factors = [];
    Object.entries(components).forEach(([key, score]) => {
        if (score > 50) {
            factors.push({
                type: key,
                description: `${key} shows elevated risk`,
                score,
                weight: 1 / Object.keys(components).length,
                evidence: [`Score: ${score.toFixed(1)}`],
            });
        }
    });
    const overallScore = Object.values(components).reduce((sum, val) => sum + val, 0) / Object.keys(components).length;
    return {
        id: crypto.randomUUID(),
        entityId: userId,
        timestamp: new Date(),
        overallScore,
        components,
        factors,
        trend: {
            direction: 'STABLE',
            changeRate: 0,
            prediction: overallScore,
            confidence: 75,
        },
        confidence: 85,
        explanation: `User behavior analysis detected ${factors.length} risk factors with overall score ${overallScore.toFixed(1)}`,
        recommendedActions: overallScore > 70
            ? ['Immediate investigation', 'Review access logs', 'Contact user']
            : ['Monitor closely', 'Update baseline'],
    };
};
exports.analyzeUserBehavior = analyzeUserBehavior;
/**
 * Calculates activity pattern risk score.
 */
const calculateActivityPatternRisk = (activities, baseline) => {
    const activityCount = activities.length;
    const expected = baseline.activityMetrics.avgDailyActivities;
    const deviation = Math.abs((activityCount - expected) / expected) * 100;
    return Math.min(100, deviation);
};
/**
 * Calculates access pattern risk score.
 */
const calculateAccessPatternRisk = (activities, baseline) => {
    const accessedResources = new Set(activities.map((a) => a.details.resource).filter(Boolean));
    const typicalResources = new Set(baseline.activityMetrics.typicalAccessPatterns);
    const unusualAccess = [...accessedResources].filter((r) => !typicalResources.has(r)).length;
    return Math.min(100, (unusualAccess / accessedResources.size) * 100);
};
/**
 * Calculates volume anomaly risk score.
 */
const calculateVolumeAnomalyRisk = (activities, baseline) => {
    const totalVolume = activities.reduce((sum, a) => sum + (a.details.dataVolume || 0), 0);
    const expected = baseline.activityMetrics.typicalDataVolume;
    if (expected === 0)
        return 0;
    const deviation = Math.abs((totalVolume - expected) / expected) * 100;
    return Math.min(100, deviation);
};
/**
 * Calculates temporal anomaly risk score.
 */
const calculateTemporalAnomalyRisk = (activities, baseline) => {
    const offHoursActivities = activities.filter((a) => {
        const hour = a.timestamp.getHours();
        return !baseline.activityMetrics.peakActivityHours.includes(hour);
    });
    return (offHoursActivities.length / activities.length) * 100;
};
/**
 * Calculates location anomaly risk score.
 */
const calculateLocationAnomalyRisk = (activities, baseline) => {
    const locations = activities.map((a) => a.location?.country).filter(Boolean);
    const unusualLocations = locations.filter((l) => !baseline.activityMetrics.commonLocations.includes(l));
    return locations.length > 0 ? (unusualLocations.length / locations.length) * 100 : 0;
};
/**
 * Calculates privilege risk score.
 */
const calculatePrivilegeRisk = (activities) => {
    const privilegeEscalations = activities.filter((a) => a.activityType === BehaviorActivityType.PRIVILEGE_ESCALATION);
    return Math.min(100, privilegeEscalations.length * 25);
};
/**
 * Calculates data access risk score.
 */
const calculateDataAccessRisk = (activities) => {
    const sensitiveAccess = activities.filter((a) => a.activityType === BehaviorActivityType.DATA_EXPORT ||
        a.activityType === BehaviorActivityType.FILE_DOWNLOAD);
    return Math.min(100, sensitiveAccess.length * 15);
};
/**
 * Analyzes entity behavior (devices, applications, service accounts).
 *
 * @param {string} entityId - Entity identifier
 * @param {BehaviorEntityType} entityType - Type of entity
 * @param {BehaviorActivity[]} activities - Entity activities
 * @param {BehaviorBaseline} baseline - Entity baseline
 * @returns {Promise<BehaviorRiskScore>} Risk assessment
 *
 * @example
 * ```typescript
 * const riskScore = await analyzeEntityBehavior('device123', BehaviorEntityType.DEVICE, activities, baseline);
 * ```
 */
const analyzeEntityBehavior = async (entityId, entityType, activities, baseline) => {
    return (0, exports.analyzeUserBehavior)(entityId, activities, baseline);
};
exports.analyzeEntityBehavior = analyzeEntityBehavior;
/**
 * Tracks behavior changes over time periods.
 *
 * @param {BehaviorActivity[]} oldPeriod - Previous period activities
 * @param {BehaviorActivity[]} newPeriod - Current period activities
 * @returns {Record<string, number>} Change metrics
 *
 * @example
 * ```typescript
 * const changes = trackBehaviorChanges(lastWeekActivities, thisWeekActivities);
 * ```
 */
const trackBehaviorChanges = (oldPeriod, newPeriod) => {
    return {
        activityCountChange: newPeriod.length - oldPeriod.length,
        activityRateChange: ((newPeriod.length - oldPeriod.length) / oldPeriod.length) * 100,
        avgSessionDurationChange: 0, // Simplified
    };
};
exports.trackBehaviorChanges = trackBehaviorChanges;
/**
 * Compares two behavioral profiles.
 *
 * @param {BehaviorBaseline} profile1 - First baseline profile
 * @param {BehaviorBaseline} profile2 - Second baseline profile
 * @returns {Record<string, number>} Comparison metrics
 *
 * @example
 * ```typescript
 * const comparison = compareBehaviorProfiles(userBaseline, peerBaseline);
 * ```
 */
const compareBehaviorProfiles = (profile1, profile2) => {
    return {
        activityRateDifference: profile2.activityMetrics.avgDailyActivities - profile1.activityMetrics.avgDailyActivities,
        sessionDurationDifference: profile2.activityMetrics.avgSessionDuration - profile1.activityMetrics.avgSessionDuration,
    };
};
exports.compareBehaviorProfiles = compareBehaviorProfiles;
/**
 * Calculates comprehensive behavior score.
 *
 * @param {BehaviorRiskScore} riskScoreData - Risk score data
 * @returns {number} Overall behavior score (0-100)
 *
 * @example
 * ```typescript
 * const score = calculateBehaviorScore(riskData);
 * ```
 */
const calculateBehaviorScore = (riskScoreData) => {
    return riskScoreData.overallScore;
};
exports.calculateBehaviorScore = calculateBehaviorScore;
/**
 * Identifies behavioral anomalies from activities.
 *
 * @param {BehaviorActivity[]} activities - Activities to analyze
 * @param {BehaviorBaseline} baseline - Behavioral baseline
 * @returns {BehaviorActivity[]} Anomalous activities
 *
 * @example
 * ```typescript
 * const anomalies = identifyBehaviorAnomalies(activities, baseline);
 * ```
 */
const identifyBehaviorAnomalies = (activities, baseline) => {
    return activities.filter((activity) => {
        const hour = activity.timestamp.getHours();
        return !baseline.activityMetrics.peakActivityHours.includes(hour);
    });
};
exports.identifyBehaviorAnomalies = identifyBehaviorAnomalies;
/**
 * Creates behavioral baseline from historical data.
 *
 * @param {string} entityId - Entity identifier
 * @param {BehaviorActivity[]} historicalActivities - Historical activities
 * @param {number} periodDays - Period in days for baseline
 * @returns {BehaviorBaseline} Generated baseline
 *
 * @example
 * ```typescript
 * const baseline = createBehaviorBaseline('user123', activities, 30);
 * ```
 */
const createBehaviorBaseline = (entityId, historicalActivities, periodDays = 30) => {
    const now = Date.now();
    const periodStart = now - periodDays * 24 * 60 * 60 * 1000;
    const relevantActivities = historicalActivities.filter((a) => a.timestamp.getTime() >= periodStart);
    const activitiesPerDay = relevantActivities.length / periodDays;
    const hoursMap = new Map();
    relevantActivities.forEach((a) => {
        const hour = a.timestamp.getHours();
        hoursMap.set(hour, (hoursMap.get(hour) || 0) + 1);
    });
    const peakHours = Array.from(hoursMap.entries())
        .sort((a, b) => b[1] - a[1])
        .slice(0, 8)
        .map(([hour]) => hour);
    return {
        id: crypto.randomUUID(),
        entityId,
        profilePeriod: {
            start: new Date(periodStart),
            end: new Date(now),
            duration: periodDays * 24 * 60 * 60 * 1000,
        },
        activityMetrics: {
            avgDailyActivities: activitiesPerDay,
            avgWeeklyActivities: activitiesPerDay * 7,
            avgSessionDuration: 3600000, // 1 hour default
            peakActivityHours: peakHours,
            commonLocations: [],
            commonDevices: [],
            typicalDataVolume: 0,
            typicalAccessPatterns: [],
        },
        patterns: [],
        normalRanges: {
            activitiesPerDay: { min: activitiesPerDay * 0.5, max: activitiesPerDay * 1.5 },
            sessionDuration: { min: 1800000, max: 7200000 },
            dataVolume: { min: 0, max: 1000000 },
            loginTimes: { earliest: Math.min(...peakHours), latest: Math.max(...peakHours) },
            accessedResources: [],
        },
        confidence: Math.min(100, (relevantActivities.length / 1000) * 100),
        sampleSize: relevantActivities.length,
        lastUpdated: new Date(),
    };
};
exports.createBehaviorBaseline = createBehaviorBaseline;
/**
 * Updates behavioral baseline with new data.
 *
 * @param {BehaviorBaseline} baseline - Current baseline
 * @param {BehaviorActivity[]} newActivities - New activities
 * @param {number} learningRate - Learning rate (0-1)
 * @returns {BehaviorBaseline} Updated baseline
 *
 * @example
 * ```typescript
 * const updated = updateBehaviorBaseline(baseline, newActivities, 0.1);
 * ```
 */
const updateBehaviorBaseline = (baseline, newActivities, learningRate = 0.1) => {
    const newAvgDaily = newActivities.length / 1; // Assume 1 day of new data
    const updatedAvg = baseline.activityMetrics.avgDailyActivities * (1 - learningRate) + newAvgDaily * learningRate;
    return {
        ...baseline,
        activityMetrics: {
            ...baseline.activityMetrics,
            avgDailyActivities: updatedAvg,
            avgWeeklyActivities: updatedAvg * 7,
        },
        lastUpdated: new Date(),
        sampleSize: baseline.sampleSize + newActivities.length,
    };
};
exports.updateBehaviorBaseline = updateBehaviorBaseline;
/**
 * Calculates baseline metrics from activity data.
 *
 * @param {BehaviorActivity[]} activities - Activities for analysis
 * @returns {ActivityMetrics} Calculated metrics
 *
 * @example
 * ```typescript
 * const metrics = calculateBaselineMetrics(activities);
 * ```
 */
const calculateBaselineMetrics = (activities) => {
    const daysSet = new Set(activities.map((a) => a.timestamp.toDateString()));
    const avgDaily = activities.length / daysSet.size;
    return {
        avgDailyActivities: avgDaily,
        avgWeeklyActivities: avgDaily * 7,
        avgSessionDuration: 3600000,
        peakActivityHours: [],
        commonLocations: [],
        commonDevices: [],
        typicalDataVolume: 0,
        typicalAccessPatterns: [],
    };
};
exports.calculateBaselineMetrics = calculateBaselineMetrics;
/**
 * Detects baseline deviation in behavior.
 *
 * @param {number} currentValue - Current metric value
 * @param {NormalRanges} normalRanges - Normal behavior ranges
 * @param {string} metric - Metric name
 * @returns {boolean} Whether deviation detected
 *
 * @example
 * ```typescript
 * const deviated = detectBaselineDeviation(150, normalRanges, 'activitiesPerDay');
 * ```
 */
const detectBaselineDeviation = (currentValue, normalRanges, metric) => {
    const range = normalRanges[metric];
    return currentValue < range.min || currentValue > range.max;
};
exports.detectBaselineDeviation = detectBaselineDeviation;
/**
 * Performs adaptive baseline learning.
 *
 * @param {BehaviorBaseline} baseline - Current baseline
 * @param {BehaviorActivity[]} recentActivities - Recent activities
 * @returns {BehaviorBaseline} Adapted baseline
 *
 * @example
 * ```typescript
 * const adapted = adaptiveBaselineLearning(baseline, recentActivities);
 * ```
 */
const adaptiveBaselineLearning = (baseline, recentActivities) => {
    return (0, exports.updateBehaviorBaseline)(baseline, recentActivities, 0.05);
};
exports.adaptiveBaselineLearning = adaptiveBaselineLearning;
/**
 * Compares entity behavior against peer group.
 *
 * @param {string} entityId - Entity identifier
 * @param {PeerGroup} peerGroup - Peer group for comparison
 * @param {BehaviorBaseline} entityBaseline - Entity's baseline
 * @returns {PeerComparisonResult} Comparison result
 *
 * @example
 * ```typescript
 * const comparison = compareToPeerGroup('user123', peerGroup, userBaseline);
 * ```
 */
const compareToPeerGroup = (entityId, peerGroup, entityBaseline) => {
    const entityActivity = entityBaseline.activityMetrics.avgDailyActivities;
    const peerAvg = peerGroup.baseline.activityMetrics.avgDailyActivities;
    const peerStdDev = peerGroup.statistics.stdDevRiskScore;
    const zScore = (entityActivity - peerAvg) / (peerStdDev || 1);
    const isOutlier = Math.abs(zScore) > 2;
    return {
        entityId,
        peerGroupId: peerGroup.id,
        deviationScore: Math.min(100, Math.abs(zScore) * 30),
        isOutlier,
        comparisons: [
            {
                metric: 'avgDailyActivities',
                entityValue: entityActivity,
                peerAverage: peerAvg,
                peerStdDev,
                zScore,
                deviation: ((entityActivity - peerAvg) / peerAvg) * 100,
                isAnomaly: isOutlier,
            },
        ],
        ranking: 0, // Would need full member data
        percentile: 50,
    };
};
exports.compareToPeerGroup = compareToPeerGroup;
/**
 * Identifies outliers within peer group.
 *
 * @param {PeerGroup} peerGroup - Peer group
 * @param {Map<string, BehaviorBaseline>} memberBaselines - Member baselines
 * @returns {string[]} Entity IDs of outliers
 *
 * @example
 * ```typescript
 * const outliers = identifyPeerGroupOutliers(peerGroup, baselines);
 * ```
 */
const identifyPeerGroupOutliers = (peerGroup, memberBaselines) => {
    const outliers = [];
    const avgActivity = peerGroup.baseline.activityMetrics.avgDailyActivities;
    const stdDev = peerGroup.statistics.stdDevRiskScore;
    peerGroup.members.forEach((memberId) => {
        const baseline = memberBaselines.get(memberId);
        if (baseline) {
            const activity = baseline.activityMetrics.avgDailyActivities;
            const zScore = Math.abs((activity - avgActivity) / stdDev);
            if (zScore > 2.5) {
                outliers.push(memberId);
            }
        }
    });
    return outliers;
};
exports.identifyPeerGroupOutliers = identifyPeerGroupOutliers;
/**
 * Calculates peer group statistics.
 *
 * @param {PeerGroup} peerGroup - Peer group
 * @param {Map<string, BehaviorRiskScore>} memberScores - Member risk scores
 * @returns {PeerGroupStatistics} Calculated statistics
 *
 * @example
 * ```typescript
 * const stats = calculatePeerGroupStatistics(peerGroup, scores);
 * ```
 */
const calculatePeerGroupStatistics = (peerGroup, memberScores) => {
    const scores = Array.from(memberScores.values()).map((s) => s.overallScore);
    const avg = scores.reduce((sum, s) => sum + s, 0) / scores.length;
    const variance = scores.reduce((sum, s) => sum + Math.pow(s - avg, 2), 0) / scores.length;
    const sorted = [...scores].sort((a, b) => a - b);
    return {
        memberCount: peerGroup.members.length,
        avgActivityRate: peerGroup.baseline.activityMetrics.avgDailyActivities,
        avgRiskScore: avg,
        stdDevRiskScore: Math.sqrt(variance),
        medianRiskScore: sorted[Math.floor(sorted.length / 2)],
        outlierCount: scores.filter((s) => Math.abs(s - avg) / Math.sqrt(variance) > 2).length,
        lastUpdated: new Date(),
    };
};
exports.calculatePeerGroupStatistics = calculatePeerGroupStatistics;
/**
 * Detects insider threat indicators.
 *
 * @param {string} entityId - Entity identifier
 * @param {BehaviorActivity[]} activities - Recent activities
 * @param {BehaviorBaseline} baseline - Behavioral baseline
 * @returns {InsiderThreatIndicator[]} Detected threat indicators
 *
 * @example
 * ```typescript
 * const threats = detectInsiderThreats('user123', activities, baseline);
 * ```
 */
const detectInsiderThreats = (entityId, activities, baseline) => {
    const indicators = [];
    // Check for data exfiltration
    const largeDownloads = activities.filter((a) => a.activityType === BehaviorActivityType.FILE_DOWNLOAD &&
        (a.details.dataVolume || 0) > baseline.activityMetrics.typicalDataVolume * 5);
    if (largeDownloads.length > 0) {
        indicators.push({
            id: crypto.randomUUID(),
            entityId,
            indicatorType: InsiderThreatType.DATA_EXFILTRATION,
            severity: BehaviorRiskLevel.HIGH,
            confidence: 80,
            evidence: largeDownloads.map((a) => ({
                type: 'activity',
                description: `Large download: ${a.details.dataVolume} bytes`,
                timestamp: a.timestamp,
                confidence: 80,
                source: 'activity_monitor',
            })),
            detectedAt: new Date(),
            description: `Detected ${largeDownloads.length} unusually large downloads`,
            recommendedActions: ['Investigate downloads', 'Review accessed files', 'Contact user'],
        });
    }
    // Check for privilege escalation
    const privilegeChanges = activities.filter((a) => a.activityType === BehaviorActivityType.PRIVILEGE_ESCALATION);
    if (privilegeChanges.length > 0) {
        indicators.push({
            id: crypto.randomUUID(),
            entityId,
            indicatorType: InsiderThreatType.PRIVILEGE_ABUSE,
            severity: BehaviorRiskLevel.CRITICAL,
            confidence: 90,
            evidence: privilegeChanges.map((a) => ({
                type: 'privilege_change',
                description: 'Privilege escalation detected',
                timestamp: a.timestamp,
                confidence: 90,
                source: 'privilege_monitor',
            })),
            detectedAt: new Date(),
            description: `Detected ${privilegeChanges.length} privilege escalations`,
            recommendedActions: ['Immediate review', 'Revoke privileges', 'Security audit'],
        });
    }
    return indicators;
};
exports.detectInsiderThreats = detectInsiderThreats;
/**
 * Analyzes temporal behavior patterns.
 *
 * @param {string} entityId - Entity identifier
 * @param {BehaviorActivity[]} activities - Activities to analyze
 * @param {TimeRange} timeWindow - Analysis time window
 * @returns {TemporalBehaviorAnalysis} Temporal analysis result
 *
 * @example
 * ```typescript
 * const temporal = analyzeTemporalBehavior('user123', activities, timeWindow);
 * ```
 */
const analyzeTemporalBehavior = (entityId, activities, timeWindow) => {
    const patterns = [];
    const anomalies = [];
    // Detect off-hours activity
    const offHours = activities.filter((a) => {
        const hour = a.timestamp.getHours();
        return hour < 6 || hour > 22;
    });
    if (offHours.length > activities.length * 0.3) {
        anomalies.push({
            timestamp: new Date(),
            type: 'TIME_OF_DAY',
            severity: BehaviorRiskLevel.MEDIUM,
            description: `${((offHours.length / activities.length) * 100).toFixed(1)}% of activity outside business hours`,
            expectedValue: '<10%',
            actualValue: `${((offHours.length / activities.length) * 100).toFixed(1)}%`,
            deviation: (offHours.length / activities.length) * 100,
        });
    }
    return {
        entityId,
        timeWindow,
        patterns,
        anomalies,
        trends: [],
        riskScore: anomalies.length > 0 ? 60 : 20,
    };
};
exports.analyzeTemporalBehavior = analyzeTemporalBehavior;
/**
 * Calculates risk trend over time.
 *
 * @param {BehaviorRiskScore[]} historicalScores - Historical risk scores
 * @returns {RiskTrend} Risk trend analysis
 *
 * @example
 * ```typescript
 * const trend = calculateRiskTrend(scores);
 * ```
 */
const calculateRiskTrend = (historicalScores) => {
    if (historicalScores.length < 2) {
        return {
            direction: 'STABLE',
            changeRate: 0,
            prediction: historicalScores[0]?.overallScore || 0,
            confidence: 50,
        };
    }
    const sorted = [...historicalScores].sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
    const first = sorted[0].overallScore;
    const last = sorted[sorted.length - 1].overallScore;
    const changeRate = ((last - first) / first) * 100;
    return {
        direction: changeRate > 10 ? 'INCREASING' : changeRate < -10 ? 'DECREASING' : 'STABLE',
        changeRate,
        prediction: last + (changeRate / 100) * last,
        confidence: 70,
    };
};
exports.calculateRiskTrend = calculateRiskTrend;
/**
 * Predicts future risk score.
 *
 * @param {BehaviorRiskScore[]} historicalScores - Historical scores
 * @param {number} daysAhead - Days to predict ahead
 * @returns {number} Predicted risk score
 *
 * @example
 * ```typescript
 * const predicted = predictRiskScore(scores, 7);
 * ```
 */
const predictRiskScore = (historicalScores, daysAhead) => {
    const trend = (0, exports.calculateRiskTrend)(historicalScores);
    return Math.min(100, Math.max(0, trend.prediction));
};
exports.predictRiskScore = predictRiskScore;
/**
 * Generates behavioral analytics report.
 *
 * @param {string} entityId - Entity identifier
 * @param {BehaviorRiskScore[]} scores - Risk scores
 * @param {InsiderThreatIndicator[]} threats - Threat indicators
 * @returns {Record<string, any>} Analytics report
 *
 * @example
 * ```typescript
 * const report = generateBehaviorAnalyticsReport('user123', scores, threats);
 * ```
 */
const generateBehaviorAnalyticsReport = (entityId, scores, threats) => {
    const avgScore = scores.reduce((sum, s) => sum + s.overallScore, 0) / scores.length;
    return {
        entityId,
        reportDate: new Date(),
        avgRiskScore: avgScore,
        currentRiskLevel: avgScore > 70 ? 'HIGH' : avgScore > 40 ? 'MEDIUM' : 'LOW',
        threatCount: threats.length,
        criticalThreats: threats.filter((t) => t.severity === BehaviorRiskLevel.CRITICAL).length,
        trend: (0, exports.calculateRiskTrend)(scores),
        recommendations: avgScore > 70
            ? ['Immediate investigation required', 'Enhanced monitoring', 'Access review']
            : ['Continue monitoring', 'Periodic review'],
    };
};
exports.generateBehaviorAnalyticsReport = generateBehaviorAnalyticsReport;
/**
 * Calculates confidence interval for risk score.
 *
 * @param {BehaviorRiskScore[]} scores - Historical scores
 * @param {number} confidenceLevel - Confidence level (0-1)
 * @returns {{lower: number, upper: number}} Confidence interval
 *
 * @example
 * ```typescript
 * const interval = calculateRiskConfidenceInterval(scores, 0.95);
 * ```
 */
const calculateRiskConfidenceInterval = (scores, confidenceLevel = 0.95) => {
    const values = scores.map((s) => s.overallScore);
    const mean = values.reduce((sum, v) => sum + v, 0) / values.length;
    const stdDev = Math.sqrt(values.reduce((sum, v) => sum + Math.pow(v - mean, 2), 0) / values.length);
    const margin = 1.96 * stdDev; // 95% confidence
    return {
        lower: Math.max(0, mean - margin),
        upper: Math.min(100, mean + margin),
    };
};
exports.calculateRiskConfidenceInterval = calculateRiskConfidenceInterval;
/**
 * Aggregates multiple risk scores.
 *
 * @param {BehaviorRiskScore[]} scores - Scores to aggregate
 * @returns {number} Aggregated score
 *
 * @example
 * ```typescript
 * const aggregated = aggregateRiskScores(scores);
 * ```
 */
const aggregateRiskScores = (scores) => {
    return scores.reduce((sum, s) => sum + s.overallScore, 0) / scores.length;
};
exports.aggregateRiskScores = aggregateRiskScores;
/**
 * Normalizes risk scores to 0-100 range.
 *
 * @param {number[]} scores - Raw scores
 * @returns {number[]} Normalized scores
 *
 * @example
 * ```typescript
 * const normalized = normalizeRiskScores(rawScores);
 * ```
 */
const normalizeRiskScores = (scores) => {
    const max = Math.max(...scores);
    const min = Math.min(...scores);
    const range = max - min;
    if (range === 0)
        return scores.map(() => 50);
    return scores.map((score) => ((score - min) / range) * 100);
};
exports.normalizeRiskScores = normalizeRiskScores;
/**
 * Determines risk level from score.
 *
 * @param {number} riskScore - Risk score (0-100)
 * @returns {BehaviorRiskLevel} Risk level
 *
 * @example
 * ```typescript
 * const level = determineRiskLevel(75);
 * ```
 */
const determineRiskLevel = (riskScore) => {
    if (riskScore >= 80)
        return BehaviorRiskLevel.CRITICAL;
    if (riskScore >= 60)
        return BehaviorRiskLevel.HIGH;
    if (riskScore >= 40)
        return BehaviorRiskLevel.MEDIUM;
    if (riskScore >= 20)
        return BehaviorRiskLevel.LOW;
    return BehaviorRiskLevel.MINIMAL;
};
exports.determineRiskLevel = determineRiskLevel;
/**
 * Validates behavioral baseline data.
 *
 * @param {BehaviorBaseline} baseline - Baseline to validate
 * @returns {boolean} Whether baseline is valid
 *
 * @example
 * ```typescript
 * const isValid = validateBehaviorBaseline(baseline);
 * ```
 */
const validateBehaviorBaseline = (baseline) => {
    return (baseline.sampleSize >= 100 &&
        baseline.confidence >= 50 &&
        baseline.activityMetrics.avgDailyActivities > 0);
};
exports.validateBehaviorBaseline = validateBehaviorBaseline;
/**
 * Merges multiple behavioral baselines.
 *
 * @param {BehaviorBaseline[]} baselines - Baselines to merge
 * @returns {BehaviorBaseline} Merged baseline
 *
 * @example
 * ```typescript
 * const merged = mergeBehaviorBaselines([baseline1, baseline2]);
 * ```
 */
const mergeBehaviorBaselines = (baselines) => {
    const avgDaily = baselines.reduce((sum, b) => sum + b.activityMetrics.avgDailyActivities, 0) / baselines.length;
    return {
        ...baselines[0],
        activityMetrics: {
            ...baselines[0].activityMetrics,
            avgDailyActivities: avgDaily,
            avgWeeklyActivities: avgDaily * 7,
        },
        sampleSize: baselines.reduce((sum, b) => sum + b.sampleSize, 0),
        confidence: Math.max(...baselines.map((b) => b.confidence)),
        lastUpdated: new Date(),
    };
};
exports.mergeBehaviorBaselines = mergeBehaviorBaselines;
/**
 * Exports behavioral data for analysis.
 *
 * @param {string} entityId - Entity identifier
 * @param {BehaviorActivity[]} activities - Activities
 * @param {BehaviorRiskScore[]} scores - Risk scores
 * @returns {Record<string, any>} Exported data
 *
 * @example
 * ```typescript
 * const exported = exportBehaviorData('user123', activities, scores);
 * ```
 */
const exportBehaviorData = (entityId, activities, scores) => {
    return {
        entityId,
        exportDate: new Date(),
        activityCount: activities.length,
        scoreCount: scores.length,
        avgRiskScore: scores.reduce((sum, s) => sum + s.overallScore, 0) / scores.length,
        activities: activities.map((a) => ({
            timestamp: a.timestamp,
            type: a.activityType,
            riskScore: a.riskScore,
        })),
        scores: scores.map((s) => ({
            timestamp: s.timestamp,
            score: s.overallScore,
        })),
    };
};
exports.exportBehaviorData = exportBehaviorData;
/**
 * Calculates behavioral entropy (measure of predictability).
 *
 * @param {BehaviorActivity[]} activities - Activities to analyze
 * @returns {number} Entropy value (0-1, higher = more unpredictable)
 *
 * @example
 * ```typescript
 * const entropy = calculateBehavioralEntropy(activities);
 * ```
 */
const calculateBehavioralEntropy = (activities) => {
    const typeCounts = new Map();
    activities.forEach((a) => {
        typeCounts.set(a.activityType, (typeCounts.get(a.activityType) || 0) + 1);
    });
    let entropy = 0;
    const total = activities.length;
    typeCounts.forEach((count) => {
        const probability = count / total;
        entropy -= probability * Math.log2(probability);
    });
    return entropy / Math.log2(Object.keys(BehaviorActivityType).length);
};
exports.calculateBehavioralEntropy = calculateBehavioralEntropy;
/**
 * Scores behavioral consistency.
 *
 * @param {BehaviorActivity[]} activities - Activities
 * @param {BehaviorBaseline} baseline - Baseline
 * @returns {number} Consistency score (0-100, higher = more consistent)
 *
 * @example
 * ```typescript
 * const consistency = scoreBehaviorConsistency(activities, baseline);
 * ```
 */
const scoreBehaviorConsistency = (activities, baseline) => {
    const entropy = (0, exports.calculateBehavioralEntropy)(activities);
    return Math.max(0, (1 - entropy) * 100);
};
exports.scoreBehaviorConsistency = scoreBehaviorConsistency;
/**
 * Detects behavioral pattern shifts.
 *
 * @param {BehaviorBaseline} oldBaseline - Previous baseline
 * @param {BehaviorBaseline} newBaseline - Current baseline
 * @returns {boolean} Whether significant shift detected
 *
 * @example
 * ```typescript
 * const shifted = detectBehaviorShift(oldBaseline, newBaseline);
 * ```
 */
const detectBehaviorShift = (oldBaseline, newBaseline) => {
    const activityChange = Math.abs(newBaseline.activityMetrics.avgDailyActivities - oldBaseline.activityMetrics.avgDailyActivities) / oldBaseline.activityMetrics.avgDailyActivities;
    return activityChange > 0.5; // 50% change threshold
};
exports.detectBehaviorShift = detectBehaviorShift;
/**
 * Calculates behavioral stability score.
 *
 * @param {BehaviorRiskScore[]} scores - Historical scores
 * @returns {number} Stability score (0-100, higher = more stable)
 *
 * @example
 * ```typescript
 * const stability = calculateBehaviorStability(scores);
 * ```
 */
const calculateBehaviorStability = (scores) => {
    const values = scores.map((s) => s.overallScore);
    const mean = values.reduce((sum, v) => sum + v, 0) / values.length;
    const variance = values.reduce((sum, v) => sum + Math.pow(v - mean, 2), 0) / values.length;
    const stdDev = Math.sqrt(variance);
    return Math.max(0, 100 - stdDev);
};
exports.calculateBehaviorStability = calculateBehaviorStability;
/**
 * Generates behavioral risk heatmap data.
 *
 * @param {Map<string, BehaviorRiskScore>} entityScores - Entity scores
 * @returns {Record<string, any>} Heatmap data
 *
 * @example
 * ```typescript
 * const heatmap = generateRiskHeatmap(entityScores);
 * ```
 */
const generateRiskHeatmap = (entityScores) => {
    const data = {};
    entityScores.forEach((score, entityId) => {
        data[entityId] = score.overallScore;
    });
    return {
        type: 'heatmap',
        data,
        timestamp: new Date(),
        maxScore: Math.max(...Object.values(data)),
        minScore: Math.min(...Object.values(data)),
    };
};
exports.generateRiskHeatmap = generateRiskHeatmap;
/**
 * Filters activities by type.
 *
 * @param {BehaviorActivity[]} activities - Activities to filter
 * @param {BehaviorActivityType[]} types - Activity types to include
 * @returns {BehaviorActivity[]} Filtered activities
 *
 * @example
 * ```typescript
 * const logins = filterActivitiesByType(activities, [BehaviorActivityType.LOGIN]);
 * ```
 */
const filterActivitiesByType = (activities, types) => {
    const typeSet = new Set(types);
    return activities.filter((a) => typeSet.has(a.activityType));
};
exports.filterActivitiesByType = filterActivitiesByType;
/**
 * Calculates activity frequency distribution.
 *
 * @param {BehaviorActivity[]} activities - Activities to analyze
 * @returns {Map<BehaviorActivityType, number>} Frequency distribution
 *
 * @example
 * ```typescript
 * const distribution = calculateActivityFrequency(activities);
 * ```
 */
const calculateActivityFrequency = (activities) => {
    const frequency = new Map();
    activities.forEach((activity) => {
        frequency.set(activity.activityType, (frequency.get(activity.activityType) || 0) + 1);
    });
    return frequency;
};
exports.calculateActivityFrequency = calculateActivityFrequency;
/**
 * Detects privilegeescalation patterns.
 *
 * @param {BehaviorActivity[]} activities - Activities to analyze
 * @returns {InsiderThreatIndicator[]} Detected privilege escalation indicators
 *
 * @example
 * ```typescript
 * const escalations = detectPrivilegeEscalation(activities);
 * ```
 */
const detectPrivilegeEscalation = (activities) => {
    const indicators = [];
    const escalations = activities.filter((a) => a.activityType === BehaviorActivityType.PRIVILEGE_ESCALATION);
    if (escalations.length > 0) {
        const entityIds = [...new Set(escalations.map((a) => a.entityId))];
        entityIds.forEach((entityId) => {
            const userEscalations = escalations.filter((a) => a.entityId === entityId);
            indicators.push({
                id: crypto.randomUUID(),
                entityId,
                indicatorType: InsiderThreatType.PRIVILEGE_ABUSE,
                severity: BehaviorRiskLevel.CRITICAL,
                confidence: 90,
                evidence: userEscalations.map((a) => ({
                    type: 'privilege_escalation',
                    description: `Privilege escalation at ${a.timestamp.toISOString()}`,
                    timestamp: a.timestamp,
                    confidence: 90,
                    source: 'activity_monitor',
                })),
                detectedAt: new Date(),
                description: `Detected ${userEscalations.length} privilege escalation(s)`,
                recommendedActions: ['Immediate investigation', 'Review privilege changes', 'Audit user permissions'],
            });
        });
    }
    return indicators;
};
exports.detectPrivilegeEscalation = detectPrivilegeEscalation;
/**
 * Detects data exfiltration patterns.
 *
 * @param {BehaviorActivity[]} activities - Activities to analyze
 * @param {number} volumeThreshold - Volume threshold in bytes
 * @returns {InsiderThreatIndicator[]} Detected exfiltration indicators
 *
 * @example
 * ```typescript
 * const exfiltration = detectDataExfiltration(activities, 10000000);
 * ```
 */
const detectDataExfiltration = (activities, volumeThreshold) => {
    const indicators = [];
    const downloads = activities.filter((a) => a.activityType === BehaviorActivityType.FILE_DOWNLOAD);
    const entityVolumes = new Map();
    downloads.forEach((download) => {
        const volume = download.details.dataVolume || 0;
        entityVolumes.set(download.entityId, (entityVolumes.get(download.entityId) || 0) + volume);
    });
    entityVolumes.forEach((volume, entityId) => {
        if (volume > volumeThreshold) {
            indicators.push({
                id: crypto.randomUUID(),
                entityId,
                indicatorType: InsiderThreatType.DATA_EXFILTRATION,
                severity: BehaviorRiskLevel.HIGH,
                confidence: 85,
                evidence: [
                    {
                        type: 'data_volume',
                        description: `Downloaded ${(volume / 1000000).toFixed(2)} MB`,
                        timestamp: new Date(),
                        confidence: 85,
                        source: 'data_monitor',
                    },
                ],
                detectedAt: new Date(),
                description: `Excessive data download: ${(volume / 1000000).toFixed(2)} MB`,
                recommendedActions: ['Investigate downloads', 'Review downloaded files', 'Check destination'],
            });
        }
    });
    return indicators;
};
exports.detectDataExfiltration = detectDataExfiltration;
/**
 * Calculates trust score for entity.
 *
 * @param {string} entityId - Entity identifier
 * @param {BehaviorActivity[]} activities - Entity activities
 * @param {BehaviorRiskScore[]} historicalScores - Historical risk scores
 * @returns {number} Trust score (0-100)
 *
 * @example
 * ```typescript
 * const trust = calculateTrustScore('user123', activities, scores);
 * ```
 */
const calculateTrustScore = (entityId, activities, historicalScores) => {
    const avgRisk = historicalScores.reduce((sum, s) => sum + s.overallScore, 0) / historicalScores.length || 0;
    const failureCount = activities.filter((a) => a.details.result === 'failure').length;
    const failureRate = activities.length > 0 ? failureCount / activities.length : 0;
    const baseTrust = 100 - avgRisk;
    const penaltyforFailures = failureRate * 20;
    return Math.max(0, baseTrust - penaltyforFailures);
};
exports.calculateTrustScore = calculateTrustScore;
/**
 * Creates peer group from entity list.
 *
 * @param {string} name - Peer group name
 * @param {PeerGroupCriteria} criteria - Membership criteria
 * @param {BehaviorEntity[]} entities - Entities to evaluate
 * @returns {PeerGroup} Created peer group
 *
 * @example
 * ```typescript
 * const group = createPeerGroup('Finance Team', criteria, entities);
 * ```
 */
const createPeerGroup = (name, criteria, entities) => {
    const members = entities
        .filter((entity) => {
        if (criteria.department && !criteria.department.includes(entity.department || ''))
            return false;
        if (criteria.role && !criteria.role.includes(entity.role || ''))
            return false;
        if (criteria.entityType && !criteria.entityType.includes(entity.type))
            return false;
        return true;
    })
        .map((e) => e.id);
    return {
        id: crypto.randomUUID(),
        name,
        description: `Peer group with ${members.length} members`,
        criteria,
        members,
        baseline: {
            id: crypto.randomUUID(),
            entityId: 'peer_group',
            profilePeriod: {
                start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
                end: new Date(),
                duration: 30 * 24 * 60 * 60 * 1000,
            },
            activityMetrics: {
                avgDailyActivities: 0,
                avgWeeklyActivities: 0,
                avgSessionDuration: 0,
                peakActivityHours: [],
                commonLocations: [],
                commonDevices: [],
                typicalDataVolume: 0,
                typicalAccessPatterns: [],
            },
            patterns: [],
            normalRanges: {
                activitiesPerDay: { min: 0, max: 100 },
                sessionDuration: { min: 0, max: 7200000 },
                dataVolume: { min: 0, max: 1000000 },
                loginTimes: { earliest: 0, latest: 23 },
                accessedResources: [],
            },
            confidence: 50,
            sampleSize: 0,
            lastUpdated: new Date(),
        },
        statistics: {
            memberCount: members.length,
            avgActivityRate: 0,
            avgRiskScore: 0,
            stdDevRiskScore: 0,
            medianRiskScore: 0,
            outlierCount: 0,
            lastUpdated: new Date(),
        },
        createdAt: new Date(),
        updatedAt: new Date(),
    };
};
exports.createPeerGroup = createPeerGroup;
/**
 * Scores behavioral anomaly severity.
 *
 * @param {BehaviorActivity} activity - Activity to score
 * @param {BehaviorBaseline} baseline - Behavioral baseline
 * @returns {number} Severity score (0-100)
 *
 * @example
 * ```typescript
 * const severity = scoreBehaviorAnomalySeverity(activity, baseline);
 * ```
 */
const scoreBehaviorAnomalySeverity = (activity, baseline) => {
    let score = 0;
    // Check time of day
    const hour = activity.timestamp.getHours();
    if (!baseline.activityMetrics.peakActivityHours.includes(hour)) {
        score += 20;
    }
    // Check location
    if (activity.location && !baseline.activityMetrics.commonLocations.includes(activity.location.country)) {
        score += 30;
    }
    // Check activity type
    if ([
        BehaviorActivityType.PRIVILEGE_ESCALATION,
        BehaviorActivityType.DATA_EXPORT,
        BehaviorActivityType.FILE_DELETE,
    ].includes(activity.activityType)) {
        score += 40;
    }
    return Math.min(100, score);
};
exports.scoreBehaviorAnomalySeverity = scoreBehaviorAnomalySeverity;
// ============================================================================
// NESTJS SERVICE EXAMPLE
// ============================================================================
/**
 * Behavioral Analytics Service
 * Production-ready NestJS service for UEBA operations
 */
let BehavioralAnalyticsService = (() => {
    let _classDecorators = [(0, common_1.Injectable)()];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    var BehavioralAnalyticsService = _classThis = class {
        /**
         * Performs comprehensive behavioral analysis
         */
        async performBehaviorAnalysis(entityId, activities, baseline) {
            return (0, exports.analyzeUserBehavior)(entityId, activities, baseline);
        }
        /**
         * Detects insider threats
         */
        async detectInsiderThreats(entityId, activities, baseline) {
            return (0, exports.detectInsiderThreats)(entityId, activities, baseline);
        }
        /**
         * Compares entity to peer group
         */
        async compareToPeers(entityId, peerGroup, entityBaseline) {
            return (0, exports.compareToPeerGroup)(entityId, peerGroup, entityBaseline);
        }
    };
    __setFunctionName(_classThis, "BehavioralAnalyticsService");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        BehavioralAnalyticsService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return BehavioralAnalyticsService = _classThis;
})();
exports.BehavioralAnalyticsService = BehavioralAnalyticsService;
// ============================================================================
// EXPORTS
// ============================================================================
exports.default = {
    // Models
    BehaviorEntityModel,
    BehaviorActivityModel,
    BehaviorRiskScoreModel,
    PeerGroupModel,
    InsiderThreatIndicatorModel,
    // Core Functions
    analyzeUserBehavior: exports.analyzeUserBehavior,
    analyzeEntityBehavior: exports.analyzeEntityBehavior,
    trackBehaviorChanges: exports.trackBehaviorChanges,
    compareBehaviorProfiles: exports.compareBehaviorProfiles,
    calculateBehaviorScore: exports.calculateBehaviorScore,
    identifyBehaviorAnomalies: exports.identifyBehaviorAnomalies,
    createBehaviorBaseline: exports.createBehaviorBaseline,
    updateBehaviorBaseline: exports.updateBehaviorBaseline,
    calculateBaselineMetrics: exports.calculateBaselineMetrics,
    detectBaselineDeviation: exports.detectBaselineDeviation,
    adaptiveBaselineLearning: exports.adaptiveBaselineLearning,
    compareToPeerGroup: exports.compareToPeerGroup,
    identifyPeerGroupOutliers: exports.identifyPeerGroupOutliers,
    calculatePeerGroupStatistics: exports.calculatePeerGroupStatistics,
    detectInsiderThreats: exports.detectInsiderThreats,
    analyzeTemporalBehavior: exports.analyzeTemporalBehavior,
    calculateRiskTrend: exports.calculateRiskTrend,
    predictRiskScore: exports.predictRiskScore,
    generateBehaviorAnalyticsReport: exports.generateBehaviorAnalyticsReport,
    calculateRiskConfidenceInterval: exports.calculateRiskConfidenceInterval,
    aggregateRiskScores: exports.aggregateRiskScores,
    normalizeRiskScores: exports.normalizeRiskScores,
    determineRiskLevel: exports.determineRiskLevel,
    validateBehaviorBaseline: exports.validateBehaviorBaseline,
    mergeBehaviorBaselines: exports.mergeBehaviorBaselines,
    exportBehaviorData: exports.exportBehaviorData,
    calculateBehavioralEntropy: exports.calculateBehavioralEntropy,
    scoreBehaviorConsistency: exports.scoreBehaviorConsistency,
    detectBehaviorShift: exports.detectBehaviorShift,
    calculateBehaviorStability: exports.calculateBehaviorStability,
    generateRiskHeatmap: exports.generateRiskHeatmap,
    filterActivitiesByType: exports.filterActivitiesByType,
    calculateActivityFrequency: exports.calculateActivityFrequency,
    detectPrivilegeEscalation: exports.detectPrivilegeEscalation,
    detectDataExfiltration: exports.detectDataExfiltration,
    calculateTrustScore: exports.calculateTrustScore,
    createPeerGroup: exports.createPeerGroup,
    scoreBehaviorAnomalySeverity: exports.scoreBehaviorAnomalySeverity,
    // Services
    BehavioralAnalyticsService,
};
//# sourceMappingURL=behavioral-analytics-composite.js.map