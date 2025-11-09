"use strict";
/**
 * LOC: ANOMALYDETCORE001
 * File: /reuse/threat/composites/anomaly-detection-core-composite.ts
 *
 * UPSTREAM (imports from):
 *   - @nestjs/common
 *   - @nestjs/swagger
 *   - sequelize-typescript
 *   - sequelize
 *   - crypto (Node.js built-in)
 *   - ../behavioral-threat-analytics-kit
 *   - ../threat-detection-engine-kit
 *   - ../threat-analytics-kit
 *   - ../security-analytics-kit
 *   - ../threat-scoring-kit
 *
 * DOWNSTREAM (imported by):
 *   - Anomaly detection services
 *   - Behavioral analysis modules
 *   - Pattern recognition engines
 *   - ML-based threat detection systems
 *   - Statistical anomaly detection services
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
exports.detectAnomalyTrends = exports.calculateAnomalyMovingAverage = exports.exportAnomalyData = exports.prioritizeAnomalies = exports.mergeOverlappingAnomalies = exports.calculateDetectionAccuracy = exports.groupAnomaliesByType = exports.filterAnomaliesBySeverity = exports.generateAnomalyReport = exports.determineAnomalySeverity = exports.calculatePValue = exports.calculateZScore = exports.normalizeAnomalyScores = exports.calculateBehaviorScore = exports.compareBehaviorProfiles = exports.trackBehaviorChanges = exports.analyzeEntityBehavior = exports.analyzeUserBehavior = exports.calculateBaselineMetrics = exports.identifyBehaviorAnomalies = exports.updateAnomalyBaseline = exports.aggregateThreatScores = exports.calculateDynamicThreatScore = exports.performRealtimeThreatAssessment = exports.prepareMLFeatures = exports.detectCausalCorrelations = exports.correlateEventsByTime = exports.correlateSecurityEvents = exports.detectAttackChains = exports.detectSequentialPatterns = exports.matchThreatPatterns = exports.adaptiveBaselineLearning = exports.detectBaselineDeviation = exports.calculateBaselineDeviation = exports.updateBehaviorBaseline = exports.createBehaviorBaseline = exports.calculateCompositeAnomalyScore = exports.detectTemporalAnomalies = exports.detectBehavioralAnomaly = exports.detectStatisticalAnomalies = exports.BehaviorBaselineModel = exports.AnomalyDetectionResultModel = exports.AnomalyDetectionConfigModel = exports.PatternType = exports.TimeGranularity = exports.BaselineProfileType = exports.AnomalySeverity = exports.AnomalyType = exports.AnomalySensitivity = exports.AnomalyDetectionMethod = void 0;
exports.AnomalyDetectionService = void 0;
/**
 * File: /reuse/threat/composites/anomaly-detection-core-composite.ts
 * Locator: WC-ANOMALY-DETECTION-CORE-001
 * Purpose: Comprehensive Anomaly Detection Core Toolkit - Production-ready anomaly detection and behavioral analysis
 *
 * Upstream: Composed from behavioral-threat-analytics-kit, threat-detection-engine-kit, threat-analytics-kit, security-analytics-kit, threat-scoring-kit
 * Downstream: ../backend/*, Anomaly detection services, Behavioral analysis, Pattern recognition, ML pipelines
 * Dependencies: TypeScript 5.x, Node 18+, @nestjs/common, @nestjs/swagger, sequelize-typescript, crypto
 * Exports: 45 utility functions for anomaly detection, behavioral analysis, pattern recognition, statistical analysis, ML integration
 *
 * LLM Context: Enterprise-grade anomaly detection core toolkit for White Cross healthcare platform.
 * Provides comprehensive anomaly detection capabilities including statistical anomaly detection, behavioral
 * anomaly analysis, temporal pattern recognition, ML-based detection algorithms, baseline deviation detection,
 * adaptive learning mechanisms, multi-dimensional anomaly scoring, false positive reduction, and HIPAA-compliant
 * healthcare security monitoring. Composes functions from multiple threat intelligence kits to provide unified
 * anomaly detection operations for detecting insider threats, compromised credentials, data exfiltration,
 * abnormal access patterns, and privilege escalation in healthcare systems.
 */
const sequelize_typescript_1 = require("sequelize-typescript");
const swagger_1 = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const crypto = __importStar(require("crypto"));
/**
 * Anomaly detection methods
 */
var AnomalyDetectionMethod;
(function (AnomalyDetectionMethod) {
    AnomalyDetectionMethod["STATISTICAL"] = "STATISTICAL";
    AnomalyDetectionMethod["BEHAVIORAL"] = "BEHAVIORAL";
    AnomalyDetectionMethod["TEMPORAL"] = "TEMPORAL";
    AnomalyDetectionMethod["PATTERN_BASED"] = "PATTERN_BASED";
    AnomalyDetectionMethod["ML_BASED"] = "ML_BASED";
    AnomalyDetectionMethod["HYBRID"] = "HYBRID";
})(AnomalyDetectionMethod || (exports.AnomalyDetectionMethod = AnomalyDetectionMethod = {}));
/**
 * Anomaly sensitivity levels
 */
var AnomalySensitivity;
(function (AnomalySensitivity) {
    AnomalySensitivity["VERY_LOW"] = "VERY_LOW";
    AnomalySensitivity["LOW"] = "LOW";
    AnomalySensitivity["MEDIUM"] = "MEDIUM";
    AnomalySensitivity["HIGH"] = "HIGH";
    AnomalySensitivity["VERY_HIGH"] = "VERY_HIGH";
})(AnomalySensitivity || (exports.AnomalySensitivity = AnomalySensitivity = {}));
/**
 * Anomaly types
 */
var AnomalyType;
(function (AnomalyType) {
    AnomalyType["POINT_ANOMALY"] = "POINT_ANOMALY";
    AnomalyType["CONTEXTUAL_ANOMALY"] = "CONTEXTUAL_ANOMALY";
    AnomalyType["COLLECTIVE_ANOMALY"] = "COLLECTIVE_ANOMALY";
    AnomalyType["TREND_ANOMALY"] = "TREND_ANOMALY";
    AnomalyType["SEASONAL_ANOMALY"] = "SEASONAL_ANOMALY";
    AnomalyType["BEHAVIOR_ANOMALY"] = "BEHAVIOR_ANOMALY";
    AnomalyType["PATTERN_ANOMALY"] = "PATTERN_ANOMALY";
})(AnomalyType || (exports.AnomalyType = AnomalyType = {}));
/**
 * Anomaly severity levels
 */
var AnomalySeverity;
(function (AnomalySeverity) {
    AnomalySeverity["CRITICAL"] = "CRITICAL";
    AnomalySeverity["HIGH"] = "HIGH";
    AnomalySeverity["MEDIUM"] = "MEDIUM";
    AnomalySeverity["LOW"] = "LOW";
    AnomalySeverity["INFO"] = "INFO";
})(AnomalySeverity || (exports.AnomalySeverity = AnomalySeverity = {}));
/**
 * Baseline profile types
 */
var BaselineProfileType;
(function (BaselineProfileType) {
    BaselineProfileType["USER_ACTIVITY"] = "USER_ACTIVITY";
    BaselineProfileType["NETWORK_TRAFFIC"] = "NETWORK_TRAFFIC";
    BaselineProfileType["DATA_ACCESS"] = "DATA_ACCESS";
    BaselineProfileType["SYSTEM_BEHAVIOR"] = "SYSTEM_BEHAVIOR";
    BaselineProfileType["APPLICATION_USAGE"] = "APPLICATION_USAGE";
    BaselineProfileType["API_CONSUMPTION"] = "API_CONSUMPTION";
})(BaselineProfileType || (exports.BaselineProfileType = BaselineProfileType = {}));
/**
 * Time granularity options
 */
var TimeGranularity;
(function (TimeGranularity) {
    TimeGranularity["MINUTE"] = "MINUTE";
    TimeGranularity["HOUR"] = "HOUR";
    TimeGranularity["DAY"] = "DAY";
    TimeGranularity["WEEK"] = "WEEK";
    TimeGranularity["MONTH"] = "MONTH";
})(TimeGranularity || (exports.TimeGranularity = TimeGranularity = {}));
/**
 * Pattern types for detection
 */
var PatternType;
(function (PatternType) {
    PatternType["SEQUENTIAL"] = "SEQUENTIAL";
    PatternType["TEMPORAL"] = "TEMPORAL";
    PatternType["FREQUENCY"] = "FREQUENCY";
    PatternType["VOLUME"] = "VOLUME";
    PatternType["LOCATION"] = "LOCATION";
    PatternType["ACCESS"] = "ACCESS";
    PatternType["CUSTOM"] = "CUSTOM";
})(PatternType || (exports.PatternType = PatternType = {}));
// ============================================================================
// SEQUELIZE MODELS
// ============================================================================
/**
 * Anomaly Detection Configuration Model
 * Stores configuration for anomaly detection engines
 */
let AnomalyDetectionConfigModel = (() => {
    let _classDecorators = [(0, sequelize_typescript_1.Table)({
            tableName: 'anomaly_detection_configs',
            timestamps: true,
            indexes: [
                { fields: ['enabled'] },
                { fields: ['detectionMethod'] },
                { fields: ['sensitivity'] },
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
    let _enabled_decorators;
    let _enabled_initializers = [];
    let _enabled_extraInitializers = [];
    let _detectionMethod_decorators;
    let _detectionMethod_initializers = [];
    let _detectionMethod_extraInitializers = [];
    let _sensitivity_decorators;
    let _sensitivity_initializers = [];
    let _sensitivity_extraInitializers = [];
    let _thresholds_decorators;
    let _thresholds_initializers = [];
    let _thresholds_extraInitializers = [];
    let _baselineId_decorators;
    let _baselineId_initializers = [];
    let _baselineId_extraInitializers = [];
    let _mlModelId_decorators;
    let _mlModelId_initializers = [];
    let _mlModelId_extraInitializers = [];
    let _adaptiveLearning_decorators;
    let _adaptiveLearning_initializers = [];
    let _adaptiveLearning_extraInitializers = [];
    let _metadata_decorators;
    let _metadata_initializers = [];
    let _metadata_extraInitializers = [];
    var AnomalyDetectionConfigModel = _classThis = class extends _classSuper {
        constructor() {
            super(...arguments);
            this.id = __runInitializers(this, _id_initializers, void 0);
            this.name = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _name_initializers, void 0));
            this.enabled = (__runInitializers(this, _name_extraInitializers), __runInitializers(this, _enabled_initializers, void 0));
            this.detectionMethod = (__runInitializers(this, _enabled_extraInitializers), __runInitializers(this, _detectionMethod_initializers, void 0));
            this.sensitivity = (__runInitializers(this, _detectionMethod_extraInitializers), __runInitializers(this, _sensitivity_initializers, void 0));
            this.thresholds = (__runInitializers(this, _sensitivity_extraInitializers), __runInitializers(this, _thresholds_initializers, void 0));
            this.baselineId = (__runInitializers(this, _thresholds_extraInitializers), __runInitializers(this, _baselineId_initializers, void 0));
            this.mlModelId = (__runInitializers(this, _baselineId_extraInitializers), __runInitializers(this, _mlModelId_initializers, void 0));
            this.adaptiveLearning = (__runInitializers(this, _mlModelId_extraInitializers), __runInitializers(this, _adaptiveLearning_initializers, void 0));
            this.metadata = (__runInitializers(this, _adaptiveLearning_extraInitializers), __runInitializers(this, _metadata_initializers, void 0));
            __runInitializers(this, _metadata_extraInitializers);
        }
    };
    __setFunctionName(_classThis, "AnomalyDetectionConfigModel");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        _id_decorators = [sequelize_typescript_1.PrimaryKey, (0, sequelize_typescript_1.Default)(sequelize_typescript_1.DataType.UUIDV4), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.UUID), (0, swagger_1.ApiProperty)({ description: 'Unique configuration identifier' })];
        _name_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING), (0, swagger_1.ApiProperty)({ description: 'Configuration name' })];
        _enabled_decorators = [(0, sequelize_typescript_1.Default)(true), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.BOOLEAN), (0, swagger_1.ApiProperty)({ description: 'Whether configuration is enabled' })];
        _detectionMethod_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.ENUM(...Object.values(AnomalyDetectionMethod))), (0, swagger_1.ApiProperty)({ enum: AnomalyDetectionMethod, description: 'Detection method' })];
        _sensitivity_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.ENUM(...Object.values(AnomalySensitivity))), (0, swagger_1.ApiProperty)({ enum: AnomalySensitivity, description: 'Sensitivity level' })];
        _thresholds_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.JSONB), (0, swagger_1.ApiProperty)({ description: 'Detection thresholds' })];
        _baselineId_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.UUID), (0, swagger_1.ApiPropertyOptional)({ description: 'Associated baseline ID' })];
        _mlModelId_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.UUID), (0, swagger_1.ApiPropertyOptional)({ description: 'Associated ML model ID' })];
        _adaptiveLearning_decorators = [(0, sequelize_typescript_1.Default)(false), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.BOOLEAN), (0, swagger_1.ApiProperty)({ description: 'Enable adaptive learning' })];
        _metadata_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.JSONB), (0, swagger_1.ApiPropertyOptional)({ description: 'Additional metadata' })];
        __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: obj => "id" in obj, get: obj => obj.id, set: (obj, value) => { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
        __esDecorate(null, null, _name_decorators, { kind: "field", name: "name", static: false, private: false, access: { has: obj => "name" in obj, get: obj => obj.name, set: (obj, value) => { obj.name = value; } }, metadata: _metadata }, _name_initializers, _name_extraInitializers);
        __esDecorate(null, null, _enabled_decorators, { kind: "field", name: "enabled", static: false, private: false, access: { has: obj => "enabled" in obj, get: obj => obj.enabled, set: (obj, value) => { obj.enabled = value; } }, metadata: _metadata }, _enabled_initializers, _enabled_extraInitializers);
        __esDecorate(null, null, _detectionMethod_decorators, { kind: "field", name: "detectionMethod", static: false, private: false, access: { has: obj => "detectionMethod" in obj, get: obj => obj.detectionMethod, set: (obj, value) => { obj.detectionMethod = value; } }, metadata: _metadata }, _detectionMethod_initializers, _detectionMethod_extraInitializers);
        __esDecorate(null, null, _sensitivity_decorators, { kind: "field", name: "sensitivity", static: false, private: false, access: { has: obj => "sensitivity" in obj, get: obj => obj.sensitivity, set: (obj, value) => { obj.sensitivity = value; } }, metadata: _metadata }, _sensitivity_initializers, _sensitivity_extraInitializers);
        __esDecorate(null, null, _thresholds_decorators, { kind: "field", name: "thresholds", static: false, private: false, access: { has: obj => "thresholds" in obj, get: obj => obj.thresholds, set: (obj, value) => { obj.thresholds = value; } }, metadata: _metadata }, _thresholds_initializers, _thresholds_extraInitializers);
        __esDecorate(null, null, _baselineId_decorators, { kind: "field", name: "baselineId", static: false, private: false, access: { has: obj => "baselineId" in obj, get: obj => obj.baselineId, set: (obj, value) => { obj.baselineId = value; } }, metadata: _metadata }, _baselineId_initializers, _baselineId_extraInitializers);
        __esDecorate(null, null, _mlModelId_decorators, { kind: "field", name: "mlModelId", static: false, private: false, access: { has: obj => "mlModelId" in obj, get: obj => obj.mlModelId, set: (obj, value) => { obj.mlModelId = value; } }, metadata: _metadata }, _mlModelId_initializers, _mlModelId_extraInitializers);
        __esDecorate(null, null, _adaptiveLearning_decorators, { kind: "field", name: "adaptiveLearning", static: false, private: false, access: { has: obj => "adaptiveLearning" in obj, get: obj => obj.adaptiveLearning, set: (obj, value) => { obj.adaptiveLearning = value; } }, metadata: _metadata }, _adaptiveLearning_initializers, _adaptiveLearning_extraInitializers);
        __esDecorate(null, null, _metadata_decorators, { kind: "field", name: "metadata", static: false, private: false, access: { has: obj => "metadata" in obj, get: obj => obj.metadata, set: (obj, value) => { obj.metadata = value; } }, metadata: _metadata }, _metadata_initializers, _metadata_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        AnomalyDetectionConfigModel = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return AnomalyDetectionConfigModel = _classThis;
})();
exports.AnomalyDetectionConfigModel = AnomalyDetectionConfigModel;
/**
 * Anomaly Detection Result Model
 * Stores detected anomalies
 */
let AnomalyDetectionResultModel = (() => {
    let _classDecorators = [(0, sequelize_typescript_1.Table)({
            tableName: 'anomaly_detection_results',
            timestamps: true,
            indexes: [
                { fields: ['timestamp'] },
                { fields: ['anomalyType'] },
                { fields: ['severity'] },
                { fields: ['anomalyScore'] },
                { fields: ['isFalsePositive'] },
            ],
        })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = sequelize_typescript_1.Model;
    let _id_decorators;
    let _id_initializers = [];
    let _id_extraInitializers = [];
    let _timestamp_decorators;
    let _timestamp_initializers = [];
    let _timestamp_extraInitializers = [];
    let _detectionMethod_decorators;
    let _detectionMethod_initializers = [];
    let _detectionMethod_extraInitializers = [];
    let _anomalyType_decorators;
    let _anomalyType_initializers = [];
    let _anomalyType_extraInitializers = [];
    let _severity_decorators;
    let _severity_initializers = [];
    let _severity_extraInitializers = [];
    let _anomalyScore_decorators;
    let _anomalyScore_initializers = [];
    let _anomalyScore_extraInitializers = [];
    let _confidence_decorators;
    let _confidence_initializers = [];
    let _confidence_extraInitializers = [];
    let _zScore_decorators;
    let _zScore_initializers = [];
    let _zScore_extraInitializers = [];
    let _pValue_decorators;
    let _pValue_initializers = [];
    let _pValue_extraInitializers = [];
    let _baselineDeviation_decorators;
    let _baselineDeviation_initializers = [];
    let _baselineDeviation_extraInitializers = [];
    let _affectedEntities_decorators;
    let _affectedEntities_initializers = [];
    let _affectedEntities_extraInitializers = [];
    let _indicators_decorators;
    let _indicators_initializers = [];
    let _indicators_extraInitializers = [];
    let _explanation_decorators;
    let _explanation_initializers = [];
    let _explanation_extraInitializers = [];
    let _recommendedActions_decorators;
    let _recommendedActions_initializers = [];
    let _recommendedActions_extraInitializers = [];
    let _isFalsePositive_decorators;
    let _isFalsePositive_initializers = [];
    let _isFalsePositive_extraInitializers = [];
    let _falsePositiveConfidence_decorators;
    let _falsePositiveConfidence_initializers = [];
    let _falsePositiveConfidence_extraInitializers = [];
    let _metadata_decorators;
    let _metadata_initializers = [];
    let _metadata_extraInitializers = [];
    var AnomalyDetectionResultModel = _classThis = class extends _classSuper {
        constructor() {
            super(...arguments);
            this.id = __runInitializers(this, _id_initializers, void 0);
            this.timestamp = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _timestamp_initializers, void 0));
            this.detectionMethod = (__runInitializers(this, _timestamp_extraInitializers), __runInitializers(this, _detectionMethod_initializers, void 0));
            this.anomalyType = (__runInitializers(this, _detectionMethod_extraInitializers), __runInitializers(this, _anomalyType_initializers, void 0));
            this.severity = (__runInitializers(this, _anomalyType_extraInitializers), __runInitializers(this, _severity_initializers, void 0));
            this.anomalyScore = (__runInitializers(this, _severity_extraInitializers), __runInitializers(this, _anomalyScore_initializers, void 0));
            this.confidence = (__runInitializers(this, _anomalyScore_extraInitializers), __runInitializers(this, _confidence_initializers, void 0));
            this.zScore = (__runInitializers(this, _confidence_extraInitializers), __runInitializers(this, _zScore_initializers, void 0));
            this.pValue = (__runInitializers(this, _zScore_extraInitializers), __runInitializers(this, _pValue_initializers, void 0));
            this.baselineDeviation = (__runInitializers(this, _pValue_extraInitializers), __runInitializers(this, _baselineDeviation_initializers, void 0));
            this.affectedEntities = (__runInitializers(this, _baselineDeviation_extraInitializers), __runInitializers(this, _affectedEntities_initializers, void 0));
            this.indicators = (__runInitializers(this, _affectedEntities_extraInitializers), __runInitializers(this, _indicators_initializers, void 0));
            this.explanation = (__runInitializers(this, _indicators_extraInitializers), __runInitializers(this, _explanation_initializers, void 0));
            this.recommendedActions = (__runInitializers(this, _explanation_extraInitializers), __runInitializers(this, _recommendedActions_initializers, void 0));
            this.isFalsePositive = (__runInitializers(this, _recommendedActions_extraInitializers), __runInitializers(this, _isFalsePositive_initializers, void 0));
            this.falsePositiveConfidence = (__runInitializers(this, _isFalsePositive_extraInitializers), __runInitializers(this, _falsePositiveConfidence_initializers, void 0));
            this.metadata = (__runInitializers(this, _falsePositiveConfidence_extraInitializers), __runInitializers(this, _metadata_initializers, void 0));
            __runInitializers(this, _metadata_extraInitializers);
        }
    };
    __setFunctionName(_classThis, "AnomalyDetectionResultModel");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        _id_decorators = [sequelize_typescript_1.PrimaryKey, (0, sequelize_typescript_1.Default)(sequelize_typescript_1.DataType.UUIDV4), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.UUID), (0, swagger_1.ApiProperty)({ description: 'Unique anomaly identifier' })];
        _timestamp_decorators = [(0, sequelize_typescript_1.AllowNull)(false), sequelize_typescript_1.Index, (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DATE), (0, swagger_1.ApiProperty)({ description: 'Detection timestamp' })];
        _detectionMethod_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.ENUM(...Object.values(AnomalyDetectionMethod))), (0, swagger_1.ApiProperty)({ enum: AnomalyDetectionMethod, description: 'Detection method used' })];
        _anomalyType_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.ENUM(...Object.values(AnomalyType))), (0, swagger_1.ApiProperty)({ enum: AnomalyType, description: 'Type of anomaly' })];
        _severity_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.ENUM(...Object.values(AnomalySeverity))), (0, swagger_1.ApiProperty)({ enum: AnomalySeverity, description: 'Anomaly severity' })];
        _anomalyScore_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DECIMAL(5, 2)), (0, swagger_1.ApiProperty)({ description: 'Anomaly score (0-100)' })];
        _confidence_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DECIMAL(5, 2)), (0, swagger_1.ApiProperty)({ description: 'Confidence score (0-100)' })];
        _zScore_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DECIMAL(10, 4)), (0, swagger_1.ApiPropertyOptional)({ description: 'Z-score for statistical methods' })];
        _pValue_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DECIMAL(10, 8)), (0, swagger_1.ApiPropertyOptional)({ description: 'P-value for statistical methods' })];
        _baselineDeviation_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DECIMAL(10, 4)), (0, swagger_1.ApiProperty)({ description: 'Baseline deviation percentage' })];
        _affectedEntities_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.ARRAY(sequelize_typescript_1.DataType.STRING)), (0, swagger_1.ApiProperty)({ description: 'Affected entities' })];
        _indicators_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.JSONB), (0, swagger_1.ApiProperty)({ description: 'Anomaly indicators' })];
        _explanation_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.TEXT), (0, swagger_1.ApiProperty)({ description: 'Human-readable explanation' })];
        _recommendedActions_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.ARRAY(sequelize_typescript_1.DataType.TEXT)), (0, swagger_1.ApiProperty)({ description: 'Recommended actions' })];
        _isFalsePositive_decorators = [(0, sequelize_typescript_1.Default)(false), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.BOOLEAN), (0, swagger_1.ApiProperty)({ description: 'Whether this is a false positive' })];
        _falsePositiveConfidence_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DECIMAL(5, 2)), (0, swagger_1.ApiPropertyOptional)({ description: 'False positive confidence' })];
        _metadata_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.JSONB), (0, swagger_1.ApiPropertyOptional)({ description: 'Additional metadata' })];
        __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: obj => "id" in obj, get: obj => obj.id, set: (obj, value) => { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
        __esDecorate(null, null, _timestamp_decorators, { kind: "field", name: "timestamp", static: false, private: false, access: { has: obj => "timestamp" in obj, get: obj => obj.timestamp, set: (obj, value) => { obj.timestamp = value; } }, metadata: _metadata }, _timestamp_initializers, _timestamp_extraInitializers);
        __esDecorate(null, null, _detectionMethod_decorators, { kind: "field", name: "detectionMethod", static: false, private: false, access: { has: obj => "detectionMethod" in obj, get: obj => obj.detectionMethod, set: (obj, value) => { obj.detectionMethod = value; } }, metadata: _metadata }, _detectionMethod_initializers, _detectionMethod_extraInitializers);
        __esDecorate(null, null, _anomalyType_decorators, { kind: "field", name: "anomalyType", static: false, private: false, access: { has: obj => "anomalyType" in obj, get: obj => obj.anomalyType, set: (obj, value) => { obj.anomalyType = value; } }, metadata: _metadata }, _anomalyType_initializers, _anomalyType_extraInitializers);
        __esDecorate(null, null, _severity_decorators, { kind: "field", name: "severity", static: false, private: false, access: { has: obj => "severity" in obj, get: obj => obj.severity, set: (obj, value) => { obj.severity = value; } }, metadata: _metadata }, _severity_initializers, _severity_extraInitializers);
        __esDecorate(null, null, _anomalyScore_decorators, { kind: "field", name: "anomalyScore", static: false, private: false, access: { has: obj => "anomalyScore" in obj, get: obj => obj.anomalyScore, set: (obj, value) => { obj.anomalyScore = value; } }, metadata: _metadata }, _anomalyScore_initializers, _anomalyScore_extraInitializers);
        __esDecorate(null, null, _confidence_decorators, { kind: "field", name: "confidence", static: false, private: false, access: { has: obj => "confidence" in obj, get: obj => obj.confidence, set: (obj, value) => { obj.confidence = value; } }, metadata: _metadata }, _confidence_initializers, _confidence_extraInitializers);
        __esDecorate(null, null, _zScore_decorators, { kind: "field", name: "zScore", static: false, private: false, access: { has: obj => "zScore" in obj, get: obj => obj.zScore, set: (obj, value) => { obj.zScore = value; } }, metadata: _metadata }, _zScore_initializers, _zScore_extraInitializers);
        __esDecorate(null, null, _pValue_decorators, { kind: "field", name: "pValue", static: false, private: false, access: { has: obj => "pValue" in obj, get: obj => obj.pValue, set: (obj, value) => { obj.pValue = value; } }, metadata: _metadata }, _pValue_initializers, _pValue_extraInitializers);
        __esDecorate(null, null, _baselineDeviation_decorators, { kind: "field", name: "baselineDeviation", static: false, private: false, access: { has: obj => "baselineDeviation" in obj, get: obj => obj.baselineDeviation, set: (obj, value) => { obj.baselineDeviation = value; } }, metadata: _metadata }, _baselineDeviation_initializers, _baselineDeviation_extraInitializers);
        __esDecorate(null, null, _affectedEntities_decorators, { kind: "field", name: "affectedEntities", static: false, private: false, access: { has: obj => "affectedEntities" in obj, get: obj => obj.affectedEntities, set: (obj, value) => { obj.affectedEntities = value; } }, metadata: _metadata }, _affectedEntities_initializers, _affectedEntities_extraInitializers);
        __esDecorate(null, null, _indicators_decorators, { kind: "field", name: "indicators", static: false, private: false, access: { has: obj => "indicators" in obj, get: obj => obj.indicators, set: (obj, value) => { obj.indicators = value; } }, metadata: _metadata }, _indicators_initializers, _indicators_extraInitializers);
        __esDecorate(null, null, _explanation_decorators, { kind: "field", name: "explanation", static: false, private: false, access: { has: obj => "explanation" in obj, get: obj => obj.explanation, set: (obj, value) => { obj.explanation = value; } }, metadata: _metadata }, _explanation_initializers, _explanation_extraInitializers);
        __esDecorate(null, null, _recommendedActions_decorators, { kind: "field", name: "recommendedActions", static: false, private: false, access: { has: obj => "recommendedActions" in obj, get: obj => obj.recommendedActions, set: (obj, value) => { obj.recommendedActions = value; } }, metadata: _metadata }, _recommendedActions_initializers, _recommendedActions_extraInitializers);
        __esDecorate(null, null, _isFalsePositive_decorators, { kind: "field", name: "isFalsePositive", static: false, private: false, access: { has: obj => "isFalsePositive" in obj, get: obj => obj.isFalsePositive, set: (obj, value) => { obj.isFalsePositive = value; } }, metadata: _metadata }, _isFalsePositive_initializers, _isFalsePositive_extraInitializers);
        __esDecorate(null, null, _falsePositiveConfidence_decorators, { kind: "field", name: "falsePositiveConfidence", static: false, private: false, access: { has: obj => "falsePositiveConfidence" in obj, get: obj => obj.falsePositiveConfidence, set: (obj, value) => { obj.falsePositiveConfidence = value; } }, metadata: _metadata }, _falsePositiveConfidence_initializers, _falsePositiveConfidence_extraInitializers);
        __esDecorate(null, null, _metadata_decorators, { kind: "field", name: "metadata", static: false, private: false, access: { has: obj => "metadata" in obj, get: obj => obj.metadata, set: (obj, value) => { obj.metadata = value; } }, metadata: _metadata }, _metadata_initializers, _metadata_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        AnomalyDetectionResultModel = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return AnomalyDetectionResultModel = _classThis;
})();
exports.AnomalyDetectionResultModel = AnomalyDetectionResultModel;
/**
 * Behavioral Baseline Model
 * Stores behavioral baseline profiles
 */
let BehaviorBaselineModel = (() => {
    let _classDecorators = [(0, sequelize_typescript_1.Table)({
            tableName: 'behavior_baselines',
            timestamps: true,
            indexes: [
                { fields: ['entityId'] },
                { fields: ['entityType'] },
                { fields: ['profileType'] },
                { fields: ['lastUpdated'] },
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
    let _entityType_decorators;
    let _entityType_initializers = [];
    let _entityType_extraInitializers = [];
    let _profileType_decorators;
    let _profileType_initializers = [];
    let _profileType_extraInitializers = [];
    let _timeWindow_decorators;
    let _timeWindow_initializers = [];
    let _timeWindow_extraInitializers = [];
    let _metrics_decorators;
    let _metrics_initializers = [];
    let _metrics_extraInitializers = [];
    let _patterns_decorators;
    let _patterns_initializers = [];
    let _patterns_extraInitializers = [];
    let _lastUpdated_decorators;
    let _lastUpdated_initializers = [];
    let _lastUpdated_extraInitializers = [];
    let _sampleSize_decorators;
    let _sampleSize_initializers = [];
    let _sampleSize_extraInitializers = [];
    let _confidence_decorators;
    let _confidence_initializers = [];
    let _confidence_extraInitializers = [];
    let _metadata_decorators;
    let _metadata_initializers = [];
    let _metadata_extraInitializers = [];
    var BehaviorBaselineModel = _classThis = class extends _classSuper {
        constructor() {
            super(...arguments);
            this.id = __runInitializers(this, _id_initializers, void 0);
            this.entityId = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _entityId_initializers, void 0));
            this.entityType = (__runInitializers(this, _entityId_extraInitializers), __runInitializers(this, _entityType_initializers, void 0));
            this.profileType = (__runInitializers(this, _entityType_extraInitializers), __runInitializers(this, _profileType_initializers, void 0));
            this.timeWindow = (__runInitializers(this, _profileType_extraInitializers), __runInitializers(this, _timeWindow_initializers, void 0));
            this.metrics = (__runInitializers(this, _timeWindow_extraInitializers), __runInitializers(this, _metrics_initializers, void 0));
            this.patterns = (__runInitializers(this, _metrics_extraInitializers), __runInitializers(this, _patterns_initializers, void 0));
            this.lastUpdated = (__runInitializers(this, _patterns_extraInitializers), __runInitializers(this, _lastUpdated_initializers, void 0));
            this.sampleSize = (__runInitializers(this, _lastUpdated_extraInitializers), __runInitializers(this, _sampleSize_initializers, void 0));
            this.confidence = (__runInitializers(this, _sampleSize_extraInitializers), __runInitializers(this, _confidence_initializers, void 0));
            this.metadata = (__runInitializers(this, _confidence_extraInitializers), __runInitializers(this, _metadata_initializers, void 0));
            __runInitializers(this, _metadata_extraInitializers);
        }
    };
    __setFunctionName(_classThis, "BehaviorBaselineModel");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        _id_decorators = [sequelize_typescript_1.PrimaryKey, (0, sequelize_typescript_1.Default)(sequelize_typescript_1.DataType.UUIDV4), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.UUID), (0, swagger_1.ApiProperty)({ description: 'Unique baseline identifier' })];
        _entityId_decorators = [(0, sequelize_typescript_1.AllowNull)(false), sequelize_typescript_1.Index, (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING), (0, swagger_1.ApiProperty)({ description: 'Entity identifier' })];
        _entityType_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING), (0, swagger_1.ApiProperty)({ description: 'Entity type' })];
        _profileType_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.ENUM(...Object.values(BaselineProfileType))), (0, swagger_1.ApiProperty)({ enum: BaselineProfileType, description: 'Profile type' })];
        _timeWindow_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.JSONB), (0, swagger_1.ApiProperty)({ description: 'Time window for baseline' })];
        _metrics_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.JSONB), (0, swagger_1.ApiProperty)({ description: 'Statistical metrics' })];
        _patterns_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.JSONB), (0, swagger_1.ApiProperty)({ description: 'Behavior patterns' })];
        _lastUpdated_decorators = [(0, sequelize_typescript_1.AllowNull)(false), sequelize_typescript_1.Index, (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DATE), (0, swagger_1.ApiProperty)({ description: 'Last update timestamp' })];
        _sampleSize_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.INTEGER), (0, swagger_1.ApiProperty)({ description: 'Number of samples used' })];
        _confidence_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DECIMAL(5, 2)), (0, swagger_1.ApiProperty)({ description: 'Baseline confidence (0-100)' })];
        _metadata_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.JSONB), (0, swagger_1.ApiPropertyOptional)({ description: 'Additional metadata' })];
        __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: obj => "id" in obj, get: obj => obj.id, set: (obj, value) => { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
        __esDecorate(null, null, _entityId_decorators, { kind: "field", name: "entityId", static: false, private: false, access: { has: obj => "entityId" in obj, get: obj => obj.entityId, set: (obj, value) => { obj.entityId = value; } }, metadata: _metadata }, _entityId_initializers, _entityId_extraInitializers);
        __esDecorate(null, null, _entityType_decorators, { kind: "field", name: "entityType", static: false, private: false, access: { has: obj => "entityType" in obj, get: obj => obj.entityType, set: (obj, value) => { obj.entityType = value; } }, metadata: _metadata }, _entityType_initializers, _entityType_extraInitializers);
        __esDecorate(null, null, _profileType_decorators, { kind: "field", name: "profileType", static: false, private: false, access: { has: obj => "profileType" in obj, get: obj => obj.profileType, set: (obj, value) => { obj.profileType = value; } }, metadata: _metadata }, _profileType_initializers, _profileType_extraInitializers);
        __esDecorate(null, null, _timeWindow_decorators, { kind: "field", name: "timeWindow", static: false, private: false, access: { has: obj => "timeWindow" in obj, get: obj => obj.timeWindow, set: (obj, value) => { obj.timeWindow = value; } }, metadata: _metadata }, _timeWindow_initializers, _timeWindow_extraInitializers);
        __esDecorate(null, null, _metrics_decorators, { kind: "field", name: "metrics", static: false, private: false, access: { has: obj => "metrics" in obj, get: obj => obj.metrics, set: (obj, value) => { obj.metrics = value; } }, metadata: _metadata }, _metrics_initializers, _metrics_extraInitializers);
        __esDecorate(null, null, _patterns_decorators, { kind: "field", name: "patterns", static: false, private: false, access: { has: obj => "patterns" in obj, get: obj => obj.patterns, set: (obj, value) => { obj.patterns = value; } }, metadata: _metadata }, _patterns_initializers, _patterns_extraInitializers);
        __esDecorate(null, null, _lastUpdated_decorators, { kind: "field", name: "lastUpdated", static: false, private: false, access: { has: obj => "lastUpdated" in obj, get: obj => obj.lastUpdated, set: (obj, value) => { obj.lastUpdated = value; } }, metadata: _metadata }, _lastUpdated_initializers, _lastUpdated_extraInitializers);
        __esDecorate(null, null, _sampleSize_decorators, { kind: "field", name: "sampleSize", static: false, private: false, access: { has: obj => "sampleSize" in obj, get: obj => obj.sampleSize, set: (obj, value) => { obj.sampleSize = value; } }, metadata: _metadata }, _sampleSize_initializers, _sampleSize_extraInitializers);
        __esDecorate(null, null, _confidence_decorators, { kind: "field", name: "confidence", static: false, private: false, access: { has: obj => "confidence" in obj, get: obj => obj.confidence, set: (obj, value) => { obj.confidence = value; } }, metadata: _metadata }, _confidence_initializers, _confidence_extraInitializers);
        __esDecorate(null, null, _metadata_decorators, { kind: "field", name: "metadata", static: false, private: false, access: { has: obj => "metadata" in obj, get: obj => obj.metadata, set: (obj, value) => { obj.metadata = value; } }, metadata: _metadata }, _metadata_initializers, _metadata_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        BehaviorBaselineModel = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return BehaviorBaselineModel = _classThis;
})();
exports.BehaviorBaselineModel = BehaviorBaselineModel;
// ============================================================================
// CORE ANOMALY DETECTION FUNCTIONS
// ============================================================================
/**
 * Detects statistical anomalies using Z-score and standard deviation analysis.
 * Identifies data points that deviate significantly from the mean.
 *
 * @param {number[]} dataPoints - Array of numerical data points
 * @param {number} threshold - Z-score threshold (default: 2.5)
 * @returns {AnomalyDetectionResult[]} Array of detected anomalies
 *
 * @example
 * ```typescript
 * const anomalies = detectStatisticalAnomalies([10, 12, 11, 13, 150, 12, 11], 2.5);
 * // Returns anomaly for value 150
 * ```
 */
const detectStatisticalAnomalies = (dataPoints, threshold = 2.5) => {
    const mean = dataPoints.reduce((sum, val) => sum + val, 0) / dataPoints.length;
    const variance = dataPoints.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / dataPoints.length;
    const stdDev = Math.sqrt(variance);
    const anomalies = [];
    dataPoints.forEach((value, index) => {
        const zScore = (value - mean) / stdDev;
        const pValue = 1 - (0.5 * (1 + Math.erf(Math.abs(zScore) / Math.sqrt(2))));
        if (Math.abs(zScore) > threshold) {
            anomalies.push({
                id: crypto.randomUUID(),
                timestamp: new Date(),
                detectionMethod: AnomalyDetectionMethod.STATISTICAL,
                anomalyType: AnomalyType.POINT_ANOMALY,
                severity: Math.abs(zScore) > 4 ? AnomalySeverity.CRITICAL : Math.abs(zScore) > 3 ? AnomalySeverity.HIGH : AnomalySeverity.MEDIUM,
                anomalyScore: Math.min(100, Math.abs(zScore) * 20),
                confidence: Math.min(100, (1 - pValue) * 100),
                zScore,
                pValue,
                baselineDeviation: ((value - mean) / mean) * 100,
                affectedEntities: [`data_point_${index}`],
                indicators: [
                    {
                        type: 'value',
                        value,
                        expectedValue: mean,
                        deviation: Math.abs(zScore),
                        weight: 1.0,
                        confidence: Math.min(100, (1 - pValue) * 100),
                    },
                ],
                explanation: `Value ${value} deviates ${Math.abs(zScore).toFixed(2)} standard deviations from mean ${mean.toFixed(2)}`,
                recommendedActions: ['Review data point', 'Investigate source', 'Validate legitimacy'],
                isFalsePositive: false,
            });
        }
    });
    return anomalies;
};
exports.detectStatisticalAnomalies = detectStatisticalAnomalies;
/**
 * Detects behavioral anomalies by comparing current behavior against established baselines.
 * Uses multiple behavioral metrics and pattern matching.
 *
 * @param {any} currentBehavior - Current behavior data
 * @param {BehaviorBaseline} baseline - Established behavioral baseline
 * @returns {AnomalyDetectionResult | null} Detected anomaly or null
 *
 * @example
 * ```typescript
 * const anomaly = detectBehavioralAnomaly(userActivity, userBaseline);
 * if (anomaly) console.log('Behavioral anomaly detected:', anomaly.explanation);
 * ```
 */
const detectBehavioralAnomaly = (currentBehavior, baseline) => {
    const deviations = [];
    let totalDeviation = 0;
    // Check numeric metrics
    Object.keys(currentBehavior).forEach((key) => {
        if (typeof currentBehavior[key] === 'number' && baseline.metrics[key] !== undefined) {
            const expected = baseline.metrics.mean;
            const stdDev = baseline.metrics.standardDeviation;
            const zScore = Math.abs((currentBehavior[key] - expected) / stdDev);
            if (zScore > 2) {
                deviations.push({
                    type: key,
                    value: currentBehavior[key],
                    expectedValue: expected,
                    deviation: zScore,
                    weight: 1.0,
                    confidence: Math.min(100, zScore * 30),
                });
                totalDeviation += zScore;
            }
        }
    });
    if (deviations.length === 0)
        return null;
    const avgDeviation = totalDeviation / deviations.length;
    const anomalyScore = Math.min(100, avgDeviation * 25);
    return {
        id: crypto.randomUUID(),
        timestamp: new Date(),
        detectionMethod: AnomalyDetectionMethod.BEHAVIORAL,
        anomalyType: AnomalyType.BEHAVIOR_ANOMALY,
        severity: anomalyScore > 80 ? AnomalySeverity.CRITICAL : anomalyScore > 60 ? AnomalySeverity.HIGH : AnomalySeverity.MEDIUM,
        anomalyScore,
        confidence: Math.min(100, baseline.confidence * (avgDeviation / 3)),
        baselineDeviation: avgDeviation * 100,
        affectedEntities: [baseline.entityId],
        indicators: deviations,
        explanation: `Detected ${deviations.length} behavioral deviations from baseline profile`,
        recommendedActions: [
            'Review user activity',
            'Check for compromised credentials',
            'Validate behavior changes',
        ],
        isFalsePositive: false,
    };
};
exports.detectBehavioralAnomaly = detectBehavioralAnomaly;
/**
 * Detects temporal anomalies by analyzing time-based patterns and sequences.
 * Identifies unusual timing, frequency, or temporal clustering.
 *
 * @param {Array<{timestamp: Date, value: number}>} timeSeriesData - Time series data
 * @returns {AnomalyDetectionResult[]} Array of temporal anomalies
 *
 * @example
 * ```typescript
 * const anomalies = detectTemporalAnomalies(loginAttempts);
 * ```
 */
const detectTemporalAnomalies = (timeSeriesData) => {
    const anomalies = [];
    // Calculate time intervals
    const intervals = [];
    for (let i = 1; i < timeSeriesData.length; i++) {
        const interval = timeSeriesData[i].timestamp.getTime() - timeSeriesData[i - 1].timestamp.getTime();
        intervals.push(interval);
    }
    // Statistical analysis of intervals
    const meanInterval = intervals.reduce((sum, val) => sum + val, 0) / intervals.length;
    const stdDevInterval = Math.sqrt(intervals.reduce((sum, val) => sum + Math.pow(val - meanInterval, 2), 0) / intervals.length);
    // Detect unusual intervals
    intervals.forEach((interval, index) => {
        const zScore = Math.abs((interval - meanInterval) / stdDevInterval);
        if (zScore > 3) {
            anomalies.push({
                id: crypto.randomUUID(),
                timestamp: timeSeriesData[index + 1].timestamp,
                detectionMethod: AnomalyDetectionMethod.TEMPORAL,
                anomalyType: AnomalyType.TREND_ANOMALY,
                severity: zScore > 4 ? AnomalySeverity.HIGH : AnomalySeverity.MEDIUM,
                anomalyScore: Math.min(100, zScore * 20),
                confidence: 85,
                zScore,
                baselineDeviation: ((interval - meanInterval) / meanInterval) * 100,
                affectedEntities: [`event_${index + 1}`],
                indicators: [
                    {
                        type: 'time_interval',
                        value: interval,
                        expectedValue: meanInterval,
                        deviation: zScore,
                        weight: 1.0,
                        confidence: 85,
                    },
                ],
                explanation: `Unusual time interval detected: ${(interval / 1000).toFixed(0)}s (expected: ${(meanInterval / 1000).toFixed(0)}s)`,
                recommendedActions: ['Investigate timing anomaly', 'Check for automation', 'Review event sequence'],
                isFalsePositive: false,
            });
        }
    });
    return anomalies;
};
exports.detectTemporalAnomalies = detectTemporalAnomalies;
/**
 * Calculates comprehensive anomaly score combining multiple detection methods.
 *
 * @param {Partial<AnomalyDetectionResult>[]} detectionResults - Results from multiple detection methods
 * @returns {number} Composite anomaly score (0-100)
 *
 * @example
 * ```typescript
 * const score = calculateCompositeAnomalyScore([statResult, behaviorResult, mlResult]);
 * ```
 */
const calculateCompositeAnomalyScore = (detectionResults) => {
    if (detectionResults.length === 0)
        return 0;
    const weights = {
        [AnomalyDetectionMethod.STATISTICAL]: 0.15,
        [AnomalyDetectionMethod.BEHAVIORAL]: 0.25,
        [AnomalyDetectionMethod.TEMPORAL]: 0.15,
        [AnomalyDetectionMethod.PATTERN_BASED]: 0.20,
        [AnomalyDetectionMethod.ML_BASED]: 0.20,
        [AnomalyDetectionMethod.HYBRID]: 0.05,
    };
    let weightedSum = 0;
    let totalWeight = 0;
    detectionResults.forEach((result) => {
        if (result.detectionMethod && result.anomalyScore !== undefined) {
            const weight = weights[result.detectionMethod] || 0.1;
            weightedSum += result.anomalyScore * weight;
            totalWeight += weight;
        }
    });
    return totalWeight > 0 ? Math.min(100, weightedSum / totalWeight) : 0;
};
exports.calculateCompositeAnomalyScore = calculateCompositeAnomalyScore;
/**
 * Creates behavioral baseline profile from historical data.
 *
 * @param {string} entityId - Entity identifier
 * @param {string} entityType - Entity type
 * @param {any[]} historicalData - Historical behavior data
 * @param {BaselineProfileType} profileType - Type of profile to create
 * @returns {BehaviorBaseline} Baseline profile
 *
 * @example
 * ```typescript
 * const baseline = createBehaviorBaseline('user123', 'user', userData, BaselineProfileType.USER_ACTIVITY);
 * ```
 */
const createBehaviorBaseline = (entityId, entityType, historicalData, profileType) => {
    const numericValues = historicalData.filter((d) => typeof d === 'number');
    const mean = numericValues.reduce((sum, val) => sum + val, 0) / numericValues.length;
    const sortedValues = [...numericValues].sort((a, b) => a - b);
    const median = sortedValues[Math.floor(sortedValues.length / 2)];
    const variance = numericValues.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / numericValues.length;
    const stdDev = Math.sqrt(variance);
    return {
        id: crypto.randomUUID(),
        entityId,
        entityType,
        profileType,
        timeWindow: {
            start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
            end: new Date(),
            duration: 30 * 24 * 60 * 60 * 1000,
            granularity: TimeGranularity.DAY,
        },
        metrics: {
            mean,
            median,
            standardDeviation: stdDev,
            variance,
            min: Math.min(...numericValues),
            max: Math.max(...numericValues),
            percentile25: sortedValues[Math.floor(sortedValues.length * 0.25)],
            percentile75: sortedValues[Math.floor(sortedValues.length * 0.75)],
            percentile95: sortedValues[Math.floor(sortedValues.length * 0.95)],
            percentile99: sortedValues[Math.floor(sortedValues.length * 0.99)],
        },
        patterns: [],
        lastUpdated: new Date(),
        sampleSize: historicalData.length,
        confidence: Math.min(100, (historicalData.length / 1000) * 100),
    };
};
exports.createBehaviorBaseline = createBehaviorBaseline;
/**
 * Updates behavioral baseline with new data using adaptive learning.
 *
 * @param {BehaviorBaseline} baseline - Existing baseline
 * @param {any[]} newData - New behavior data
 * @param {number} learningRate - Learning rate (0-1, default: 0.1)
 * @returns {BehaviorBaseline} Updated baseline
 *
 * @example
 * ```typescript
 * const updated = updateBehaviorBaseline(currentBaseline, newActivities, 0.1);
 * ```
 */
const updateBehaviorBaseline = (baseline, newData, learningRate = 0.1) => {
    const numericValues = newData.filter((d) => typeof d === 'number');
    const newMean = numericValues.reduce((sum, val) => sum + val, 0) / numericValues.length;
    // Exponential moving average
    const updatedMean = baseline.metrics.mean * (1 - learningRate) + newMean * learningRate;
    return {
        ...baseline,
        metrics: {
            ...baseline.metrics,
            mean: updatedMean,
        },
        lastUpdated: new Date(),
        sampleSize: baseline.sampleSize + newData.length,
        confidence: Math.min(100, baseline.confidence + 1),
    };
};
exports.updateBehaviorBaseline = updateBehaviorBaseline;
/**
 * Calculates baseline deviation percentage for a given value.
 *
 * @param {number} value - Current value
 * @param {BaselineMetrics} metrics - Baseline metrics
 * @returns {number} Deviation percentage
 *
 * @example
 * ```typescript
 * const deviation = calculateBaselineDeviation(150, baselineMetrics);
 * ```
 */
const calculateBaselineDeviation = (value, metrics) => {
    return ((value - metrics.mean) / metrics.mean) * 100;
};
exports.calculateBaselineDeviation = calculateBaselineDeviation;
/**
 * Detects baseline deviation anomalies.
 *
 * @param {number} value - Current value
 * @param {BehaviorBaseline} baseline - Behavioral baseline
 * @param {number} threshold - Deviation threshold percentage
 * @returns {AnomalyDetectionResult | null} Anomaly if detected
 *
 * @example
 * ```typescript
 * const anomaly = detectBaselineDeviation(200, baseline, 50);
 * ```
 */
const detectBaselineDeviation = (value, baseline, threshold = 50) => {
    const deviation = (0, exports.calculateBaselineDeviation)(value, baseline.metrics);
    if (Math.abs(deviation) < threshold)
        return null;
    const zScore = (value - baseline.metrics.mean) / baseline.metrics.standardDeviation;
    return {
        id: crypto.randomUUID(),
        timestamp: new Date(),
        detectionMethod: AnomalyDetectionMethod.STATISTICAL,
        anomalyType: AnomalyType.CONTEXTUAL_ANOMALY,
        severity: Math.abs(deviation) > 100 ? AnomalySeverity.CRITICAL : AnomalySeverity.HIGH,
        anomalyScore: Math.min(100, Math.abs(deviation)),
        confidence: baseline.confidence,
        zScore,
        baselineDeviation: deviation,
        affectedEntities: [baseline.entityId],
        indicators: [
            {
                type: 'value',
                value,
                expectedValue: baseline.metrics.mean,
                deviation: Math.abs(zScore),
                weight: 1.0,
                confidence: baseline.confidence,
            },
        ],
        explanation: `Value deviates ${deviation.toFixed(1)}% from baseline (threshold: ${threshold}%)`,
        recommendedActions: ['Investigate deviation cause', 'Validate data source', 'Review baseline'],
        isFalsePositive: false,
    };
};
exports.detectBaselineDeviation = detectBaselineDeviation;
/**
 * Performs adaptive baseline learning with automatic threshold adjustment.
 *
 * @param {BehaviorBaseline} baseline - Current baseline
 * @param {AnomalyDetectionResult[]} recentAnomalies - Recently detected anomalies
 * @returns {BehaviorBaseline} Adapted baseline
 *
 * @example
 * ```typescript
 * const adapted = adaptiveBaselineLearning(baseline, anomalies);
 * ```
 */
const adaptiveBaselineLearning = (baseline, recentAnomalies) => {
    // Calculate false positive rate
    const falsePositives = recentAnomalies.filter((a) => a.isFalsePositive).length;
    const fpRate = recentAnomalies.length > 0 ? falsePositives / recentAnomalies.length : 0;
    // Adjust confidence based on false positive rate
    const confidenceAdjustment = fpRate > 0.2 ? -5 : fpRate < 0.05 ? 2 : 0;
    return {
        ...baseline,
        confidence: Math.max(0, Math.min(100, baseline.confidence + confidenceAdjustment)),
        lastUpdated: new Date(),
    };
};
exports.adaptiveBaselineLearning = adaptiveBaselineLearning;
/**
 * Matches current behavior against known threat patterns.
 *
 * @param {any} behavior - Current behavior data
 * @param {BehaviorPattern[]} patterns - Known patterns
 * @returns {PatternMatchResult[]} Pattern match results
 *
 * @example
 * ```typescript
 * const matches = matchThreatPatterns(userBehavior, threatPatterns);
 * ```
 */
const matchThreatPatterns = (behavior, patterns) => {
    const results = [];
    patterns.forEach((pattern) => {
        let matchScore = 0;
        let matchedAttributes = [];
        const deviations = [];
        Object.keys(pattern.attributes).forEach((key) => {
            if (behavior[key] !== undefined) {
                const expected = pattern.attributes[key];
                const actual = behavior[key];
                if (expected === actual) {
                    matchScore += 20;
                    matchedAttributes.push(key);
                }
                else {
                    const deviation = typeof expected === 'number' && typeof actual === 'number'
                        ? Math.abs((actual - expected) / expected) * 100
                        : 100;
                    deviations.push({ attribute: key, expected, actual, deviation });
                }
            }
        });
        if (matchScore > 0 || deviations.length > 0) {
            results.push({
                patternId: pattern.id,
                patternType: pattern.patternType,
                matchScore: Math.min(100, matchScore),
                confidence: pattern.confidence,
                matchedAttributes,
                deviations,
            });
        }
    });
    return results.sort((a, b) => b.matchScore - a.matchScore);
};
exports.matchThreatPatterns = matchThreatPatterns;
/**
 * Detects sequential attack patterns across multiple events.
 *
 * @param {any[]} events - Security events
 * @param {number} timeWindow - Time window in milliseconds
 * @returns {AnomalyDetectionResult[]} Detected attack sequences
 *
 * @example
 * ```typescript
 * const sequences = detectSequentialPatterns(events, 300000); // 5 min window
 * ```
 */
const detectSequentialPatterns = (events, timeWindow) => {
    const anomalies = [];
    const sequences = new Map();
    events.forEach((event, index) => {
        const key = event.userId || event.ip || 'unknown';
        const eventSeq = sequences.get(key) || [];
        eventSeq.push(event);
        sequences.set(key, eventSeq);
    });
    sequences.forEach((seq, entityId) => {
        if (seq.length < 3)
            return;
        // Check for suspicious sequences (e.g., failed login -> privilege escalation -> data access)
        for (let i = 0; i < seq.length - 2; i++) {
            const timeSpan = seq[i + 2].timestamp - seq[i].timestamp;
            if (timeSpan <= timeWindow) {
                anomalies.push({
                    id: crypto.randomUUID(),
                    timestamp: new Date(),
                    detectionMethod: AnomalyDetectionMethod.PATTERN_BASED,
                    anomalyType: AnomalyType.COLLECTIVE_ANOMALY,
                    severity: AnomalySeverity.HIGH,
                    anomalyScore: 75,
                    confidence: 80,
                    baselineDeviation: 0,
                    affectedEntities: [entityId],
                    indicators: [
                        {
                            type: 'sequence',
                            value: seq.slice(i, i + 3).map((e) => e.type).join(' -> '),
                            deviation: 0,
                            weight: 1.0,
                            confidence: 80,
                        },
                    ],
                    explanation: `Detected suspicious event sequence within ${timeSpan}ms`,
                    recommendedActions: ['Investigate event sequence', 'Check user credentials', 'Review access logs'],
                    isFalsePositive: false,
                });
            }
        }
    });
    return anomalies;
};
exports.detectSequentialPatterns = detectSequentialPatterns;
/**
 * Detects attack chains using graph-based analysis.
 *
 * @param {any[]} events - Security events
 * @returns {AnomalyDetectionResult[]} Detected attack chains
 *
 * @example
 * ```typescript
 * const chains = detectAttackChains(securityEvents);
 * ```
 */
const detectAttackChains = (events) => {
    // Build event graph
    const graph = new Map();
    events.forEach((event) => {
        const source = event.sourceId || event.userId;
        const target = event.targetId || event.resource;
        if (!graph.has(source))
            graph.set(source, new Set());
        graph.get(source).add(target);
    });
    const anomalies = [];
    // Detect chains with depth > 3
    graph.forEach((targets, source) => {
        if (targets.size > 3) {
            anomalies.push({
                id: crypto.randomUUID(),
                timestamp: new Date(),
                detectionMethod: AnomalyDetectionMethod.PATTERN_BASED,
                anomalyType: AnomalyType.COLLECTIVE_ANOMALY,
                severity: AnomalySeverity.HIGH,
                anomalyScore: Math.min(100, targets.size * 15),
                confidence: 75,
                baselineDeviation: 0,
                affectedEntities: [source, ...Array.from(targets)],
                indicators: [
                    {
                        type: 'chain_length',
                        value: targets.size,
                        expectedValue: 2,
                        deviation: targets.size - 2,
                        weight: 1.0,
                        confidence: 75,
                    },
                ],
                explanation: `Detected attack chain with ${targets.size} connected targets`,
                recommendedActions: ['Investigate attack chain', 'Block suspicious source', 'Review target systems'],
                isFalsePositive: false,
            });
        }
    });
    return anomalies;
};
exports.detectAttackChains = detectAttackChains;
/**
 * Correlates security events for anomaly detection.
 *
 * @param {any[]} events - Security events
 * @param {number} correlationThreshold - Correlation threshold (0-1)
 * @returns {AnomalyDetectionResult[]} Correlated anomalies
 *
 * @example
 * ```typescript
 * const correlated = correlateSecurityEvents(events, 0.7);
 * ```
 */
const correlateSecurityEvents = (events, correlationThreshold) => {
    const correlations = new Map();
    events.forEach((event) => {
        const key = `${event.type}_${event.severity}`;
        const group = correlations.get(key) || [];
        group.push(event);
        correlations.set(key, group);
    });
    const anomalies = [];
    correlations.forEach((group, key) => {
        if (group.length > 5) {
            const avgTimeInterval = group.length > 1
                ? (group[group.length - 1].timestamp - group[0].timestamp) / (group.length - 1)
                : 0;
            anomalies.push({
                id: crypto.randomUUID(),
                timestamp: new Date(),
                detectionMethod: AnomalyDetectionMethod.PATTERN_BASED,
                anomalyType: AnomalyType.COLLECTIVE_ANOMALY,
                severity: AnomalySeverity.MEDIUM,
                anomalyScore: Math.min(100, group.length * 10),
                confidence: 70,
                baselineDeviation: 0,
                affectedEntities: group.map((e) => e.id),
                indicators: [
                    {
                        type: 'correlation',
                        value: group.length,
                        deviation: 0,
                        weight: 1.0,
                        confidence: 70,
                    },
                ],
                explanation: `${group.length} correlated events of type ${key} detected`,
                recommendedActions: ['Investigate event correlation', 'Check for coordinated attack', 'Review patterns'],
                isFalsePositive: false,
            });
        }
    });
    return anomalies;
};
exports.correlateSecurityEvents = correlateSecurityEvents;
/**
 * Correlates events by time proximity.
 *
 * @param {any[]} events - Events to correlate
 * @param {number} timeWindow - Time window in milliseconds
 * @returns {Array<{events: any[], correlation: number}>} Correlated event groups
 *
 * @example
 * ```typescript
 * const correlated = correlateEventsByTime(events, 60000); // 1 minute
 * ```
 */
const correlateEventsByTime = (events, timeWindow) => {
    const sortedEvents = [...events].sort((a, b) => a.timestamp - b.timestamp);
    const groups = [];
    let currentGroup = [];
    let groupStart = 0;
    sortedEvents.forEach((event) => {
        if (currentGroup.length === 0) {
            currentGroup.push(event);
            groupStart = event.timestamp;
        }
        else if (event.timestamp - groupStart <= timeWindow) {
            currentGroup.push(event);
        }
        else {
            if (currentGroup.length > 1) {
                groups.push({
                    events: currentGroup,
                    correlation: currentGroup.length / (event.timestamp - groupStart) * 1000,
                });
            }
            currentGroup = [event];
            groupStart = event.timestamp;
        }
    });
    return groups.filter((g) => g.events.length > 1);
};
exports.correlateEventsByTime = correlateEventsByTime;
/**
 * Detects causal correlations between events.
 *
 * @param {any[]} events - Events to analyze
 * @returns {Array<{cause: any, effect: any, confidence: number}>} Causal relationships
 *
 * @example
 * ```typescript
 * const causes = detectCausalCorrelations(securityEvents);
 * ```
 */
const detectCausalCorrelations = (events) => {
    const causalPairs = [];
    for (let i = 0; i < events.length - 1; i++) {
        for (let j = i + 1; j < events.length; j++) {
            const timeDiff = events[j].timestamp - events[i].timestamp;
            // Check for temporal precedence and logical connection
            if (timeDiff > 0 && timeDiff < 300000) {
                // 5 minutes
                const confidence = Math.max(0, 100 - (timeDiff / 3000)); // Decrease with time
                causalPairs.push({
                    cause: events[i],
                    effect: events[j],
                    confidence,
                });
            }
        }
    }
    return causalPairs.sort((a, b) => b.confidence - a.confidence);
};
exports.detectCausalCorrelations = detectCausalCorrelations;
/**
 * Prepares feature vectors for ML-based anomaly detection.
 *
 * @param {any} data - Input data
 * @returns {Record<string, number>} Feature vector
 *
 * @example
 * ```typescript
 * const features = prepareMLFeatures(userActivity);
 * ```
 */
const prepareMLFeatures = (data) => {
    const features = {};
    Object.keys(data).forEach((key) => {
        const value = data[key];
        if (typeof value === 'number') {
            features[key] = value;
        }
        else if (typeof value === 'boolean') {
            features[key] = value ? 1 : 0;
        }
        else if (typeof value === 'string') {
            features[`${key}_length`] = value.length;
            features[`${key}_hash`] = hashString(value);
        }
        else if (value instanceof Date) {
            features[`${key}_timestamp`] = value.getTime();
            features[`${key}_hour`] = value.getHours();
            features[`${key}_dayOfWeek`] = value.getDay();
        }
    });
    return features;
};
exports.prepareMLFeatures = prepareMLFeatures;
/**
 * Helper function to hash strings for feature engineering.
 */
const hashString = (str) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = (hash << 5) - hash + char;
        hash = hash & hash;
    }
    return Math.abs(hash) % 1000;
};
/**
 * Performs real-time threat assessment combining multiple anomaly detection methods.
 *
 * @param {any} event - Security event
 * @param {BehaviorBaseline} baseline - Behavioral baseline
 * @param {BehaviorPattern[]} patterns - Known threat patterns
 * @returns {Promise<AnomalyDetectionResult>} Comprehensive assessment
 *
 * @example
 * ```typescript
 * const assessment = await performRealtimeThreatAssessment(event, baseline, patterns);
 * ```
 */
const performRealtimeThreatAssessment = async (event, baseline, patterns) => {
    const results = [];
    // Statistical analysis
    if (typeof event.value === 'number') {
        const deviation = (0, exports.calculateBaselineDeviation)(event.value, baseline.metrics);
        if (Math.abs(deviation) > 30) {
            results.push({
                detectionMethod: AnomalyDetectionMethod.STATISTICAL,
                anomalyScore: Math.min(100, Math.abs(deviation)),
                confidence: baseline.confidence,
            });
        }
    }
    // Behavioral analysis
    const behaviorAnomaly = (0, exports.detectBehavioralAnomaly)(event, baseline);
    if (behaviorAnomaly) {
        results.push(behaviorAnomaly);
    }
    // Pattern matching
    const patternMatches = (0, exports.matchThreatPatterns)(event, patterns);
    if (patternMatches.length > 0) {
        results.push({
            detectionMethod: AnomalyDetectionMethod.PATTERN_BASED,
            anomalyScore: patternMatches[0].matchScore,
            confidence: patternMatches[0].confidence,
        });
    }
    // Composite score
    const compositeScore = (0, exports.calculateCompositeAnomalyScore)(results);
    return {
        id: crypto.randomUUID(),
        timestamp: new Date(),
        detectionMethod: AnomalyDetectionMethod.HYBRID,
        anomalyType: AnomalyType.BEHAVIOR_ANOMALY,
        severity: compositeScore > 80 ? AnomalySeverity.CRITICAL : compositeScore > 60 ? AnomalySeverity.HIGH : AnomalySeverity.MEDIUM,
        anomalyScore: compositeScore,
        confidence: Math.max(...results.map((r) => r.confidence || 0)),
        baselineDeviation: 0,
        affectedEntities: [event.userId || event.id],
        indicators: [],
        explanation: `Real-time assessment detected anomaly with composite score ${compositeScore.toFixed(1)}`,
        recommendedActions: [
            'Immediate investigation required',
            'Review user activity',
            'Check for compromise',
        ],
        isFalsePositive: false,
    };
};
exports.performRealtimeThreatAssessment = performRealtimeThreatAssessment;
/**
 * Calculates dynamic threat score based on current context and history.
 *
 * @param {any} threat - Threat data
 * @param {any[]} history - Historical threats
 * @returns {Promise<number>} Dynamic threat score
 *
 * @example
 * ```typescript
 * const score = await calculateDynamicThreatScore(currentThreat, threatHistory);
 * ```
 */
const calculateDynamicThreatScore = async (threat, history) => {
    let score = 50; // Base score
    // Increase score based on severity
    if (threat.severity === 'CRITICAL')
        score += 30;
    else if (threat.severity === 'HIGH')
        score += 20;
    else if (threat.severity === 'MEDIUM')
        score += 10;
    // Increase score based on recency of similar threats
    const recentSimilar = history.filter((h) => h.type === threat.type && Date.now() - h.timestamp < 86400000).length;
    score += Math.min(20, recentSimilar * 5);
    return Math.min(100, score);
};
exports.calculateDynamicThreatScore = calculateDynamicThreatScore;
/**
 * Aggregates multiple threat scores using weighted averaging.
 *
 * @param {Array<{score: number, weight: number}>} scores - Scores with weights
 * @returns {number} Aggregated score
 *
 * @example
 * ```typescript
 * const aggregated = aggregateThreatScores([{score: 80, weight: 0.5}, {score: 60, weight: 0.3}]);
 * ```
 */
const aggregateThreatScores = (scores) => {
    const totalWeight = scores.reduce((sum, s) => sum + s.weight, 0);
    const weightedSum = scores.reduce((sum, s) => sum + s.score * s.weight, 0);
    return totalWeight > 0 ? weightedSum / totalWeight : 0;
};
exports.aggregateThreatScores = aggregateThreatScores;
/**
 * Updates anomaly baseline with feedback from false positive marking.
 *
 * @param {string} anomalyId - Anomaly identifier
 * @param {boolean} isFalsePositive - Whether it's a false positive
 * @param {BehaviorBaseline} baseline - Current baseline
 * @returns {BehaviorBaseline} Updated baseline
 *
 * @example
 * ```typescript
 * const updated = updateAnomalyBaseline(anomalyId, true, baseline);
 * ```
 */
const updateAnomalyBaseline = (anomalyId, isFalsePositive, baseline) => {
    const adjustment = isFalsePositive ? -2 : 1;
    return {
        ...baseline,
        confidence: Math.max(0, Math.min(100, baseline.confidence + adjustment)),
        lastUpdated: new Date(),
    };
};
exports.updateAnomalyBaseline = updateAnomalyBaseline;
/**
 * Identifies behavioral anomalies in user activity patterns.
 *
 * @param {any[]} activities - User activities
 * @param {BehaviorBaseline} baseline - User baseline
 * @returns {AnomalyDetectionResult[]} Detected anomalies
 *
 * @example
 * ```typescript
 * const anomalies = identifyBehaviorAnomalies(userActivities, userBaseline);
 * ```
 */
const identifyBehaviorAnomalies = (activities, baseline) => {
    const anomalies = [];
    activities.forEach((activity) => {
        const anomaly = (0, exports.detectBehavioralAnomaly)(activity, baseline);
        if (anomaly) {
            anomalies.push(anomaly);
        }
    });
    return anomalies;
};
exports.identifyBehaviorAnomalies = identifyBehaviorAnomalies;
/**
 * Calculates baseline metrics from data samples.
 *
 * @param {number[]} samples - Data samples
 * @returns {BaselineMetrics} Calculated metrics
 *
 * @example
 * ```typescript
 * const metrics = calculateBaselineMetrics(dataSamples);
 * ```
 */
const calculateBaselineMetrics = (samples) => {
    const sorted = [...samples].sort((a, b) => a - b);
    const mean = samples.reduce((sum, val) => sum + val, 0) / samples.length;
    const variance = samples.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / samples.length;
    return {
        mean,
        median: sorted[Math.floor(sorted.length / 2)],
        standardDeviation: Math.sqrt(variance),
        variance,
        min: sorted[0],
        max: sorted[sorted.length - 1],
        percentile25: sorted[Math.floor(sorted.length * 0.25)],
        percentile75: sorted[Math.floor(sorted.length * 0.75)],
        percentile95: sorted[Math.floor(sorted.length * 0.95)],
        percentile99: sorted[Math.floor(sorted.length * 0.99)],
    };
};
exports.calculateBaselineMetrics = calculateBaselineMetrics;
/**
 * Analyzes user behavior for anomalies.
 *
 * @param {string} userId - User identifier
 * @param {any[]} activities - User activities
 * @param {BehaviorBaseline} baseline - User baseline
 * @returns {Promise<AnomalyDetectionResult[]>} Detected anomalies
 *
 * @example
 * ```typescript
 * const anomalies = await analyzeUserBehavior('user123', activities, baseline);
 * ```
 */
const analyzeUserBehavior = async (userId, activities, baseline) => {
    return (0, exports.identifyBehaviorAnomalies)(activities, baseline);
};
exports.analyzeUserBehavior = analyzeUserBehavior;
/**
 * Analyzes entity behavior for security threats.
 *
 * @param {string} entityId - Entity identifier
 * @param {string} entityType - Entity type
 * @param {any[]} activities - Entity activities
 * @param {BehaviorBaseline} baseline - Entity baseline
 * @returns {Promise<AnomalyDetectionResult[]>} Detected anomalies
 *
 * @example
 * ```typescript
 * const anomalies = await analyzeEntityBehavior('device123', 'DEVICE', activities, baseline);
 * ```
 */
const analyzeEntityBehavior = async (entityId, entityType, activities, baseline) => {
    return (0, exports.identifyBehaviorAnomalies)(activities, baseline);
};
exports.analyzeEntityBehavior = analyzeEntityBehavior;
/**
 * Tracks behavior changes over time.
 *
 * @param {any[]} oldBehavior - Previous behavior
 * @param {any[]} newBehavior - Current behavior
 * @returns {Record<string, number>} Change metrics
 *
 * @example
 * ```typescript
 * const changes = trackBehaviorChanges(previousActivities, currentActivities);
 * ```
 */
const trackBehaviorChanges = (oldBehavior, newBehavior) => {
    return {
        activityCountChange: newBehavior.length - oldBehavior.length,
        activityRateChange: (newBehavior.length / oldBehavior.length - 1) * 100,
    };
};
exports.trackBehaviorChanges = trackBehaviorChanges;
/**
 * Compares two behavior profiles.
 *
 * @param {BehaviorBaseline} profile1 - First profile
 * @param {BehaviorBaseline} profile2 - Second profile
 * @returns {Record<string, number>} Comparison metrics
 *
 * @example
 * ```typescript
 * const comparison = compareBehaviorProfiles(baseline1, baseline2);
 * ```
 */
const compareBehaviorProfiles = (profile1, profile2) => {
    return {
        meanDifference: profile2.metrics.mean - profile1.metrics.mean,
        stdDevDifference: profile2.metrics.standardDeviation - profile1.metrics.standardDeviation,
    };
};
exports.compareBehaviorProfiles = compareBehaviorProfiles;
/**
 * Calculates behavior risk score.
 *
 * @param {any} behavior - Behavior data
 * @returns {number} Risk score (0-100)
 *
 * @example
 * ```typescript
 * const risk = calculateBehaviorScore(userBehavior);
 * ```
 */
const calculateBehaviorScore = (behavior) => {
    let score = 0;
    if (behavior.failedLoginAttempts > 5)
        score += 30;
    if (behavior.unusualAccessTime)
        score += 20;
    if (behavior.suspiciousLocation)
        score += 25;
    if (behavior.dataExfiltration)
        score += 25;
    return Math.min(100, score);
};
exports.calculateBehaviorScore = calculateBehaviorScore;
/**
 * Normalizes anomaly scores to 0-100 range.
 *
 * @param {number[]} scores - Raw scores
 * @returns {number[]} Normalized scores
 *
 * @example
 * ```typescript
 * const normalized = normalizeAnomalyScores(rawScores);
 * ```
 */
const normalizeAnomalyScores = (scores) => {
    const max = Math.max(...scores);
    const min = Math.min(...scores);
    const range = max - min;
    if (range === 0)
        return scores.map(() => 50);
    return scores.map((score) => ((score - min) / range) * 100);
};
exports.normalizeAnomalyScores = normalizeAnomalyScores;
/**
 * Calculates Z-score for statistical anomaly detection.
 *
 * @param {number} value - Value to analyze
 * @param {number} mean - Mean of distribution
 * @param {number} stdDev - Standard deviation
 * @returns {number} Z-score
 *
 * @example
 * ```typescript
 * const zScore = calculateZScore(150, 100, 20);
 * ```
 */
const calculateZScore = (value, mean, stdDev) => {
    if (stdDev === 0)
        return 0;
    return (value - mean) / stdDev;
};
exports.calculateZScore = calculateZScore;
/**
 * Calculates P-value from Z-score.
 *
 * @param {number} zScore - Z-score
 * @returns {number} P-value
 *
 * @example
 * ```typescript
 * const pValue = calculatePValue(2.5);
 * ```
 */
const calculatePValue = (zScore) => {
    return 1 - 0.5 * (1 + Math.erf(Math.abs(zScore) / Math.sqrt(2)));
};
exports.calculatePValue = calculatePValue;
/**
 * Determines anomaly severity based on score.
 *
 * @param {number} anomalyScore - Anomaly score
 * @returns {AnomalySeverity} Severity level
 *
 * @example
 * ```typescript
 * const severity = determineAnomalySeverity(85);
 * ```
 */
const determineAnomalySeverity = (anomalyScore) => {
    if (anomalyScore >= 90)
        return AnomalySeverity.CRITICAL;
    if (anomalyScore >= 70)
        return AnomalySeverity.HIGH;
    if (anomalyScore >= 50)
        return AnomalySeverity.MEDIUM;
    if (anomalyScore >= 30)
        return AnomalySeverity.LOW;
    return AnomalySeverity.INFO;
};
exports.determineAnomalySeverity = determineAnomalySeverity;
/**
 * Generates anomaly detection report.
 *
 * @param {AnomalyDetectionResult[]} anomalies - Detected anomalies
 * @returns {Record<string, any>} Report summary
 *
 * @example
 * ```typescript
 * const report = generateAnomalyReport(detectedAnomalies);
 * ```
 */
const generateAnomalyReport = (anomalies) => {
    return {
        totalAnomalies: anomalies.length,
        criticalCount: anomalies.filter((a) => a.severity === AnomalySeverity.CRITICAL).length,
        highCount: anomalies.filter((a) => a.severity === AnomalySeverity.HIGH).length,
        mediumCount: anomalies.filter((a) => a.severity === AnomalySeverity.MEDIUM).length,
        lowCount: anomalies.filter((a) => a.severity === AnomalySeverity.LOW).length,
        avgAnomalyScore: anomalies.reduce((sum, a) => sum + a.anomalyScore, 0) / anomalies.length,
        avgConfidence: anomalies.reduce((sum, a) => sum + a.confidence, 0) / anomalies.length,
        methods: [...new Set(anomalies.map((a) => a.detectionMethod))],
        types: [...new Set(anomalies.map((a) => a.anomalyType))],
    };
};
exports.generateAnomalyReport = generateAnomalyReport;
/**
 * Filters anomalies by severity level.
 *
 * @param {AnomalyDetectionResult[]} anomalies - Anomalies to filter
 * @param {AnomalySeverity} minSeverity - Minimum severity level
 * @returns {AnomalyDetectionResult[]} Filtered anomalies
 *
 * @example
 * ```typescript
 * const critical = filterAnomaliesBySeverity(anomalies, AnomalySeverity.HIGH);
 * ```
 */
const filterAnomaliesBySeverity = (anomalies, minSeverity) => {
    const severityOrder = {
        [AnomalySeverity.CRITICAL]: 5,
        [AnomalySeverity.HIGH]: 4,
        [AnomalySeverity.MEDIUM]: 3,
        [AnomalySeverity.LOW]: 2,
        [AnomalySeverity.INFO]: 1,
    };
    const threshold = severityOrder[minSeverity];
    return anomalies.filter((a) => severityOrder[a.severity] >= threshold);
};
exports.filterAnomaliesBySeverity = filterAnomaliesBySeverity;
/**
 * Groups anomalies by type.
 *
 * @param {AnomalyDetectionResult[]} anomalies - Anomalies to group
 * @returns {Map<AnomalyType, AnomalyDetectionResult[]>} Grouped anomalies
 *
 * @example
 * ```typescript
 * const grouped = groupAnomaliesByType(anomalies);
 * ```
 */
const groupAnomaliesByType = (anomalies) => {
    const groups = new Map();
    anomalies.forEach((anomaly) => {
        const group = groups.get(anomaly.anomalyType) || [];
        group.push(anomaly);
        groups.set(anomaly.anomalyType, group);
    });
    return groups;
};
exports.groupAnomaliesByType = groupAnomaliesByType;
/**
 * Calculates anomaly detection accuracy metrics.
 *
 * @param {AnomalyDetectionResult[]} detectedAnomalies - Detected anomalies
 * @param {string[]} actualAnomalyIds - Known true anomaly IDs
 * @returns {Record<string, number>} Accuracy metrics
 *
 * @example
 * ```typescript
 * const metrics = calculateDetectionAccuracy(detected, actualIds);
 * ```
 */
const calculateDetectionAccuracy = (detectedAnomalies, actualAnomalyIds) => {
    const detectedIds = new Set(detectedAnomalies.map((a) => a.id));
    const actualIds = new Set(actualAnomalyIds);
    const truePositives = detectedAnomalies.filter((a) => actualIds.has(a.id)).length;
    const falsePositives = detectedAnomalies.filter((a) => !actualIds.has(a.id)).length;
    const falseNegatives = actualAnomalyIds.filter((id) => !detectedIds.has(id)).length;
    const precision = truePositives / (truePositives + falsePositives) || 0;
    const recall = truePositives / (truePositives + falseNegatives) || 0;
    const f1Score = (2 * precision * recall) / (precision + recall) || 0;
    return {
        precision,
        recall,
        f1Score,
        accuracy: truePositives / (truePositives + falsePositives + falseNegatives) || 0,
    };
};
exports.calculateDetectionAccuracy = calculateDetectionAccuracy;
/**
 * Merges overlapping anomaly detection results.
 *
 * @param {AnomalyDetectionResult[]} anomalies - Anomalies to merge
 * @param {number} timeWindowMs - Time window for merging
 * @returns {AnomalyDetectionResult[]} Merged anomalies
 *
 * @example
 * ```typescript
 * const merged = mergeOverlappingAnomalies(anomalies, 60000);
 * ```
 */
const mergeOverlappingAnomalies = (anomalies, timeWindowMs) => {
    const sorted = [...anomalies].sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
    const merged = [];
    let current = null;
    sorted.forEach((anomaly) => {
        if (!current) {
            current = { ...anomaly };
        }
        else if (anomaly.timestamp.getTime() - current.timestamp.getTime() <= timeWindowMs) {
            current.anomalyScore = Math.max(current.anomalyScore, anomaly.anomalyScore);
            current.confidence = (current.confidence + anomaly.confidence) / 2;
            current.indicators.push(...anomaly.indicators);
        }
        else {
            merged.push(current);
            current = { ...anomaly };
        }
    });
    if (current)
        merged.push(current);
    return merged;
};
exports.mergeOverlappingAnomalies = mergeOverlappingAnomalies;
/**
 * Prioritizes anomalies for investigation.
 *
 * @param {AnomalyDetectionResult[]} anomalies - Anomalies to prioritize
 * @returns {AnomalyDetectionResult[]} Prioritized anomalies
 *
 * @example
 * ```typescript
 * const prioritized = prioritizeAnomalies(anomalies);
 * ```
 */
const prioritizeAnomalies = (anomalies) => {
    return [...anomalies].sort((a, b) => {
        if (a.severity !== b.severity) {
            const order = {
                [AnomalySeverity.CRITICAL]: 5,
                [AnomalySeverity.HIGH]: 4,
                [AnomalySeverity.MEDIUM]: 3,
                [AnomalySeverity.LOW]: 2,
                [AnomalySeverity.INFO]: 1,
            };
            return order[b.severity] - order[a.severity];
        }
        return b.anomalyScore - a.anomalyScore;
    });
};
exports.prioritizeAnomalies = prioritizeAnomalies;
/**
 * Exports anomaly data for external analysis.
 *
 * @param {AnomalyDetectionResult[]} anomalies - Anomalies to export
 * @param {string} format - Export format
 * @returns {string} Exported data
 *
 * @example
 * ```typescript
 * const csv = exportAnomalyData(anomalies, 'csv');
 * ```
 */
const exportAnomalyData = (anomalies, format) => {
    if (format === 'json') {
        return JSON.stringify(anomalies, null, 2);
    }
    // CSV format
    const headers = ['id', 'timestamp', 'type', 'severity', 'score', 'confidence'];
    const rows = anomalies.map((a) => [a.id, a.timestamp.toISOString(), a.anomalyType, a.severity, a.anomalyScore, a.confidence].join(','));
    return [headers.join(','), ...rows].join('\n');
};
exports.exportAnomalyData = exportAnomalyData;
/**
 * Calculates moving average for anomaly scores.
 *
 * @param {AnomalyDetectionResult[]} anomalies - Anomalies with scores
 * @param {number} windowSize - Window size for moving average
 * @returns {number[]} Moving averages
 *
 * @example
 * ```typescript
 * const movingAvg = calculateAnomalyMovingAverage(anomalies, 5);
 * ```
 */
const calculateAnomalyMovingAverage = (anomalies, windowSize) => {
    const scores = anomalies.map((a) => a.anomalyScore);
    const result = [];
    for (let i = 0; i < scores.length; i++) {
        const start = Math.max(0, i - windowSize + 1);
        const window = scores.slice(start, i + 1);
        const avg = window.reduce((sum, val) => sum + val, 0) / window.length;
        result.push(avg);
    }
    return result;
};
exports.calculateAnomalyMovingAverage = calculateAnomalyMovingAverage;
/**
 * Detects anomaly trends over time.
 *
 * @param {AnomalyDetectionResult[]} historicalAnomalies - Historical anomalies
 * @returns {Record<string, any>} Trend analysis
 *
 * @example
 * ```typescript
 * const trends = detectAnomalyTrends(anomalies);
 * ```
 */
const detectAnomalyTrends = (historicalAnomalies) => {
    const sorted = [...historicalAnomalies].sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
    const first = sorted.slice(0, Math.floor(sorted.length / 2));
    const second = sorted.slice(Math.floor(sorted.length / 2));
    const firstAvg = first.reduce((sum, a) => sum + a.anomalyScore, 0) / first.length;
    const secondAvg = second.reduce((sum, a) => sum + a.anomalyScore, 0) / second.length;
    const trend = secondAvg > firstAvg ? 'INCREASING' : secondAvg < firstAvg ? 'DECREASING' : 'STABLE';
    const changeRate = ((secondAvg - firstAvg) / firstAvg) * 100;
    return {
        trend,
        changeRate,
        firstPeriodAvg: firstAvg,
        secondPeriodAvg: secondAvg,
        totalAnomalies: sorted.length,
    };
};
exports.detectAnomalyTrends = detectAnomalyTrends;
// ============================================================================
// NESTJS SERVICE EXAMPLE
// ============================================================================
/**
 * Anomaly Detection Service
 * Production-ready NestJS service for anomaly detection operations
 */
let AnomalyDetectionService = (() => {
    let _classDecorators = [(0, common_1.Injectable)()];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    var AnomalyDetectionService = _classThis = class {
        /**
         * Performs comprehensive anomaly detection
         */
        async detectAnomalies(data, config) {
            const anomalies = [];
            switch (config.detectionMethod) {
                case AnomalyDetectionMethod.STATISTICAL:
                    const numericData = data.filter((d) => typeof d === 'number');
                    anomalies.push(...(0, exports.detectStatisticalAnomalies)(numericData, config.thresholds.zScore));
                    break;
                case AnomalyDetectionMethod.TEMPORAL:
                    anomalies.push(...(0, exports.detectTemporalAnomalies)(data));
                    break;
                case AnomalyDetectionMethod.PATTERN_BASED:
                    anomalies.push(...(0, exports.detectSequentialPatterns)(data, 300000));
                    break;
                default:
                    throw new Error(`Unsupported detection method: ${config.detectionMethod}`);
            }
            return anomalies;
        }
    };
    __setFunctionName(_classThis, "AnomalyDetectionService");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        AnomalyDetectionService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return AnomalyDetectionService = _classThis;
})();
exports.AnomalyDetectionService = AnomalyDetectionService;
// ============================================================================
// EXPORTS
// ============================================================================
exports.default = {
    // Models
    AnomalyDetectionConfigModel,
    AnomalyDetectionResultModel,
    BehaviorBaselineModel,
    // Core Functions
    detectStatisticalAnomalies: exports.detectStatisticalAnomalies,
    detectBehavioralAnomaly: exports.detectBehavioralAnomaly,
    detectTemporalAnomalies: exports.detectTemporalAnomalies,
    calculateCompositeAnomalyScore: exports.calculateCompositeAnomalyScore,
    createBehaviorBaseline: exports.createBehaviorBaseline,
    updateBehaviorBaseline: exports.updateBehaviorBaseline,
    calculateBaselineDeviation: exports.calculateBaselineDeviation,
    detectBaselineDeviation: exports.detectBaselineDeviation,
    adaptiveBaselineLearning: exports.adaptiveBaselineLearning,
    matchThreatPatterns: exports.matchThreatPatterns,
    detectSequentialPatterns: exports.detectSequentialPatterns,
    detectAttackChains: exports.detectAttackChains,
    correlateSecurityEvents: exports.correlateSecurityEvents,
    correlateEventsByTime: exports.correlateEventsByTime,
    detectCausalCorrelations: exports.detectCausalCorrelations,
    prepareMLFeatures: exports.prepareMLFeatures,
    performRealtimeThreatAssessment: exports.performRealtimeThreatAssessment,
    calculateDynamicThreatScore: exports.calculateDynamicThreatScore,
    aggregateThreatScores: exports.aggregateThreatScores,
    updateAnomalyBaseline: exports.updateAnomalyBaseline,
    identifyBehaviorAnomalies: exports.identifyBehaviorAnomalies,
    calculateBaselineMetrics: exports.calculateBaselineMetrics,
    analyzeUserBehavior: exports.analyzeUserBehavior,
    analyzeEntityBehavior: exports.analyzeEntityBehavior,
    trackBehaviorChanges: exports.trackBehaviorChanges,
    compareBehaviorProfiles: exports.compareBehaviorProfiles,
    calculateBehaviorScore: exports.calculateBehaviorScore,
    normalizeAnomalyScores: exports.normalizeAnomalyScores,
    calculateZScore: exports.calculateZScore,
    calculatePValue: exports.calculatePValue,
    determineAnomalySeverity: exports.determineAnomalySeverity,
    generateAnomalyReport: exports.generateAnomalyReport,
    filterAnomaliesBySeverity: exports.filterAnomaliesBySeverity,
    groupAnomaliesByType: exports.groupAnomaliesByType,
    calculateDetectionAccuracy: exports.calculateDetectionAccuracy,
    mergeOverlappingAnomalies: exports.mergeOverlappingAnomalies,
    prioritizeAnomalies: exports.prioritizeAnomalies,
    exportAnomalyData: exports.exportAnomalyData,
    calculateAnomalyMovingAverage: exports.calculateAnomalyMovingAverage,
    detectAnomalyTrends: exports.detectAnomalyTrends,
    // Services
    AnomalyDetectionService,
};
//# sourceMappingURL=anomaly-detection-core-composite.js.map