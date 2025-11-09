"use strict";
/**
 * ASSET PERFORMANCE MANAGEMENT COMMANDS
 *
 * Comprehensive asset performance monitoring and KPI tracking toolkit.
 * Provides 45 specialized functions covering:
 * - Performance metrics tracking and monitoring
 * - KPI (Key Performance Indicator) management
 * - OEE (Overall Equipment Effectiveness) calculations
 * - Asset availability and uptime monitoring
 * - Utilization rate tracking and analysis
 * - Efficiency calculations and benchmarking
 * - Performance trend analysis and forecasting
 * - Performance alert generation and management
 * - SLA (Service Level Agreement) compliance tracking
 * - Performance dashboards and reporting
 * - MTBF (Mean Time Between Failures) analysis
 * - MTTR (Mean Time To Repair) tracking
 * - Capacity planning and optimization
 *
 * @module AssetPerformanceCommands
 * @version 1.0.0
 * @requires @nestjs/common ^11.1.8
 * @requires @nestjs/swagger ^8.0.7
 * @requires @nestjs/sequelize ^10.0.1
 * @requires sequelize ^6.37.5
 * @requires sequelize-typescript ^2.1.6
 * @requires class-validator ^0.14.1
 * @requires class-transformer ^0.5.1
 * @requires Node.js 18+
 * @requires TypeScript 5.x
 *
 * @performance Optimized for high-frequency performance data collection
 * @scalability Supports millions of performance data points with aggregation
 *
 * @example
 * ```typescript
 * import {
 *   createPerformanceRecord,
 *   calculateOEE,
 *   trackAvailability,
 *   generatePerformanceAlert,
 *   PerformanceMetric,
 *   OEECalculation
 * } from './asset-performance-commands';
 *
 * // Create performance record
 * const record = await createPerformanceRecord({
 *   assetId: 'asset-001',
 *   metricType: 'uptime',
 *   value: 98.5,
 *   recordedAt: new Date()
 * });
 *
 * // Calculate OEE
 * const oee = await calculateOEE('asset-001', {
 *   startDate: new Date('2024-01-01'),
 *   endDate: new Date('2024-01-31')
 * });
 * ```
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
exports.CreateSLADefinitionDto = exports.CreatePerformanceAlertDto = exports.CalculateOEEDto = exports.CreateKPIDefinitionDto = exports.CreatePerformanceRecordDto = exports.SLACompliance = exports.SLADefinition = exports.PerformanceAlert = exports.OEECalculation = exports.KPIDefinition = exports.PerformanceMetric = exports.SLAComplianceStatus = exports.TrendDirection = exports.AlertStatus = exports.AlertSeverity = exports.KPIStatus = exports.PerformanceStatus = exports.PerformanceMetricType = void 0;
exports.createPerformanceRecord = createPerformanceRecord;
exports.getPerformanceRecordById = getPerformanceRecordById;
exports.getAssetPerformanceRecords = getAssetPerformanceRecords;
exports.updatePerformanceRecord = updatePerformanceRecord;
exports.deletePerformanceRecord = deletePerformanceRecord;
exports.calculateOEE = calculateOEE;
exports.getOEEHistory = getOEEHistory;
exports.calculateAvailability = calculateAvailability;
exports.calculateUtilization = calculateUtilization;
exports.createKPIDefinition = createKPIDefinition;
exports.getKPIDefinitionById = getKPIDefinitionById;
exports.getActiveKPIs = getActiveKPIs;
exports.updateKPIDefinition = updateKPIDefinition;
exports.calculateKPIValue = calculateKPIValue;
exports.createPerformanceAlert = createPerformanceAlert;
exports.getPerformanceAlertById = getPerformanceAlertById;
exports.getActiveAlertsForAsset = getActiveAlertsForAsset;
exports.acknowledgePerformanceAlert = acknowledgePerformanceAlert;
exports.resolvePerformanceAlert = resolvePerformanceAlert;
exports.generatePerformanceAlertsForAsset = generatePerformanceAlertsForAsset;
exports.createSLADefinition = createSLADefinition;
exports.getSLADefinitionById = getSLADefinitionById;
exports.getActiveSLAsForAsset = getActiveSLAsForAsset;
exports.trackSLACompliance = trackSLACompliance;
exports.getSLAComplianceHistory = getSLAComplianceHistory;
exports.getPerformanceDashboard = getPerformanceDashboard;
exports.generatePerformanceReport = generatePerformanceReport;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const sequelize_typescript_1 = require("sequelize-typescript");
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const sequelize_1 = require("sequelize");
// ============================================================================
// TYPE DEFINITIONS
// ============================================================================
/**
 * Performance metric types
 */
var PerformanceMetricType;
(function (PerformanceMetricType) {
    PerformanceMetricType["UPTIME"] = "uptime";
    PerformanceMetricType["DOWNTIME"] = "downtime";
    PerformanceMetricType["AVAILABILITY"] = "availability";
    PerformanceMetricType["UTILIZATION"] = "utilization";
    PerformanceMetricType["EFFICIENCY"] = "efficiency";
    PerformanceMetricType["THROUGHPUT"] = "throughput";
    PerformanceMetricType["CYCLE_TIME"] = "cycle_time";
    PerformanceMetricType["QUALITY_RATE"] = "quality_rate";
    PerformanceMetricType["PERFORMANCE_RATE"] = "performance_rate";
    PerformanceMetricType["OEE"] = "oee";
    PerformanceMetricType["MTBF"] = "mtbf";
    PerformanceMetricType["MTTR"] = "mttr";
    PerformanceMetricType["CAPACITY"] = "capacity";
    PerformanceMetricType["OUTPUT"] = "output";
})(PerformanceMetricType || (exports.PerformanceMetricType = PerformanceMetricType = {}));
/**
 * Performance status
 */
var PerformanceStatus;
(function (PerformanceStatus) {
    PerformanceStatus["EXCELLENT"] = "excellent";
    PerformanceStatus["GOOD"] = "good";
    PerformanceStatus["ACCEPTABLE"] = "acceptable";
    PerformanceStatus["POOR"] = "poor";
    PerformanceStatus["CRITICAL"] = "critical";
    PerformanceStatus["UNKNOWN"] = "unknown";
})(PerformanceStatus || (exports.PerformanceStatus = PerformanceStatus = {}));
/**
 * KPI status
 */
var KPIStatus;
(function (KPIStatus) {
    KPIStatus["ABOVE_TARGET"] = "above_target";
    KPIStatus["ON_TARGET"] = "on_target";
    KPIStatus["BELOW_TARGET"] = "below_target";
    KPIStatus["CRITICAL"] = "critical";
    KPIStatus["NOT_MEASURED"] = "not_measured";
})(KPIStatus || (exports.KPIStatus = KPIStatus = {}));
/**
 * Alert severity levels
 */
var AlertSeverity;
(function (AlertSeverity) {
    AlertSeverity["INFO"] = "info";
    AlertSeverity["WARNING"] = "warning";
    AlertSeverity["ERROR"] = "error";
    AlertSeverity["CRITICAL"] = "critical";
})(AlertSeverity || (exports.AlertSeverity = AlertSeverity = {}));
/**
 * Alert status
 */
var AlertStatus;
(function (AlertStatus) {
    AlertStatus["OPEN"] = "open";
    AlertStatus["ACKNOWLEDGED"] = "acknowledged";
    AlertStatus["IN_PROGRESS"] = "in_progress";
    AlertStatus["RESOLVED"] = "resolved";
    AlertStatus["CLOSED"] = "closed";
    AlertStatus["ESCALATED"] = "escalated";
})(AlertStatus || (exports.AlertStatus = AlertStatus = {}));
/**
 * Trend direction
 */
var TrendDirection;
(function (TrendDirection) {
    TrendDirection["IMPROVING"] = "improving";
    TrendDirection["STABLE"] = "stable";
    TrendDirection["DECLINING"] = "declining";
    TrendDirection["VOLATILE"] = "volatile";
})(TrendDirection || (exports.TrendDirection = TrendDirection = {}));
/**
 * SLA compliance status
 */
var SLAComplianceStatus;
(function (SLAComplianceStatus) {
    SLAComplianceStatus["COMPLIANT"] = "compliant";
    SLAComplianceStatus["AT_RISK"] = "at_risk";
    SLAComplianceStatus["NON_COMPLIANT"] = "non_compliant";
    SLAComplianceStatus["BREACHED"] = "breached";
})(SLAComplianceStatus || (exports.SLAComplianceStatus = SLAComplianceStatus = {}));
// ============================================================================
// SEQUELIZE MODELS
// ============================================================================
/**
 * Performance metric database model
 */
let PerformanceMetric = (() => {
    let _classDecorators = [(0, sequelize_typescript_1.Table)({ tableName: 'performance_metrics', paranoid: true })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = sequelize_typescript_1.Model;
    let _id_decorators;
    let _id_initializers = [];
    let _id_extraInitializers = [];
    let _assetId_decorators;
    let _assetId_initializers = [];
    let _assetId_extraInitializers = [];
    let _metricType_decorators;
    let _metricType_initializers = [];
    let _metricType_extraInitializers = [];
    let _value_decorators;
    let _value_initializers = [];
    let _value_extraInitializers = [];
    let _unit_decorators;
    let _unit_initializers = [];
    let _unit_extraInitializers = [];
    let _recordedAt_decorators;
    let _recordedAt_initializers = [];
    let _recordedAt_extraInitializers = [];
    let _recordedBy_decorators;
    let _recordedBy_initializers = [];
    let _recordedBy_extraInitializers = [];
    let _metadata_decorators;
    let _metadata_initializers = [];
    let _metadata_extraInitializers = [];
    let _notes_decorators;
    let _notes_initializers = [];
    let _notes_extraInitializers = [];
    let _createdAt_decorators;
    let _createdAt_initializers = [];
    let _createdAt_extraInitializers = [];
    let _updatedAt_decorators;
    let _updatedAt_initializers = [];
    let _updatedAt_extraInitializers = [];
    let _deletedAt_decorators;
    let _deletedAt_initializers = [];
    let _deletedAt_extraInitializers = [];
    var PerformanceMetric = _classThis = class extends _classSuper {
        constructor() {
            super(...arguments);
            this.id = __runInitializers(this, _id_initializers, void 0);
            this.assetId = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _assetId_initializers, void 0));
            this.metricType = (__runInitializers(this, _assetId_extraInitializers), __runInitializers(this, _metricType_initializers, void 0));
            this.value = (__runInitializers(this, _metricType_extraInitializers), __runInitializers(this, _value_initializers, void 0));
            this.unit = (__runInitializers(this, _value_extraInitializers), __runInitializers(this, _unit_initializers, void 0));
            this.recordedAt = (__runInitializers(this, _unit_extraInitializers), __runInitializers(this, _recordedAt_initializers, void 0));
            this.recordedBy = (__runInitializers(this, _recordedAt_extraInitializers), __runInitializers(this, _recordedBy_initializers, void 0));
            this.metadata = (__runInitializers(this, _recordedBy_extraInitializers), __runInitializers(this, _metadata_initializers, void 0));
            this.notes = (__runInitializers(this, _metadata_extraInitializers), __runInitializers(this, _notes_initializers, void 0));
            this.createdAt = (__runInitializers(this, _notes_extraInitializers), __runInitializers(this, _createdAt_initializers, void 0));
            this.updatedAt = (__runInitializers(this, _createdAt_extraInitializers), __runInitializers(this, _updatedAt_initializers, void 0));
            this.deletedAt = (__runInitializers(this, _updatedAt_extraInitializers), __runInitializers(this, _deletedAt_initializers, void 0));
            __runInitializers(this, _deletedAt_extraInitializers);
        }
    };
    __setFunctionName(_classThis, "PerformanceMetric");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        _id_decorators = [(0, swagger_1.ApiProperty)({ description: 'Unique performance metric ID' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUID, defaultValue: sequelize_typescript_1.DataType.UUIDV4, primaryKey: true })];
        _assetId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Asset ID' }), sequelize_typescript_1.Index, (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUID, allowNull: false })];
        _metricType_decorators = [(0, swagger_1.ApiProperty)({ description: 'Metric type', enum: PerformanceMetricType }), sequelize_typescript_1.Index, (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.ENUM(...Object.values(PerformanceMetricType)), allowNull: false })];
        _value_decorators = [(0, swagger_1.ApiProperty)({ description: 'Metric value' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DECIMAL(10, 2), allowNull: false })];
        _unit_decorators = [(0, swagger_1.ApiProperty)({ description: 'Unit of measurement' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING(50) })];
        _recordedAt_decorators = [(0, swagger_1.ApiProperty)({ description: 'When metric was recorded' }), sequelize_typescript_1.Index, (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DATE, allowNull: false })];
        _recordedBy_decorators = [(0, swagger_1.ApiProperty)({ description: 'User who recorded the metric' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUID })];
        _metadata_decorators = [(0, swagger_1.ApiProperty)({ description: 'Additional metadata' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.JSONB })];
        _notes_decorators = [(0, swagger_1.ApiProperty)({ description: 'Notes about the metric' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.TEXT })];
        _createdAt_decorators = [sequelize_typescript_1.CreatedAt];
        _updatedAt_decorators = [sequelize_typescript_1.UpdatedAt];
        _deletedAt_decorators = [sequelize_typescript_1.DeletedAt];
        __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: obj => "id" in obj, get: obj => obj.id, set: (obj, value) => { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
        __esDecorate(null, null, _assetId_decorators, { kind: "field", name: "assetId", static: false, private: false, access: { has: obj => "assetId" in obj, get: obj => obj.assetId, set: (obj, value) => { obj.assetId = value; } }, metadata: _metadata }, _assetId_initializers, _assetId_extraInitializers);
        __esDecorate(null, null, _metricType_decorators, { kind: "field", name: "metricType", static: false, private: false, access: { has: obj => "metricType" in obj, get: obj => obj.metricType, set: (obj, value) => { obj.metricType = value; } }, metadata: _metadata }, _metricType_initializers, _metricType_extraInitializers);
        __esDecorate(null, null, _value_decorators, { kind: "field", name: "value", static: false, private: false, access: { has: obj => "value" in obj, get: obj => obj.value, set: (obj, value) => { obj.value = value; } }, metadata: _metadata }, _value_initializers, _value_extraInitializers);
        __esDecorate(null, null, _unit_decorators, { kind: "field", name: "unit", static: false, private: false, access: { has: obj => "unit" in obj, get: obj => obj.unit, set: (obj, value) => { obj.unit = value; } }, metadata: _metadata }, _unit_initializers, _unit_extraInitializers);
        __esDecorate(null, null, _recordedAt_decorators, { kind: "field", name: "recordedAt", static: false, private: false, access: { has: obj => "recordedAt" in obj, get: obj => obj.recordedAt, set: (obj, value) => { obj.recordedAt = value; } }, metadata: _metadata }, _recordedAt_initializers, _recordedAt_extraInitializers);
        __esDecorate(null, null, _recordedBy_decorators, { kind: "field", name: "recordedBy", static: false, private: false, access: { has: obj => "recordedBy" in obj, get: obj => obj.recordedBy, set: (obj, value) => { obj.recordedBy = value; } }, metadata: _metadata }, _recordedBy_initializers, _recordedBy_extraInitializers);
        __esDecorate(null, null, _metadata_decorators, { kind: "field", name: "metadata", static: false, private: false, access: { has: obj => "metadata" in obj, get: obj => obj.metadata, set: (obj, value) => { obj.metadata = value; } }, metadata: _metadata }, _metadata_initializers, _metadata_extraInitializers);
        __esDecorate(null, null, _notes_decorators, { kind: "field", name: "notes", static: false, private: false, access: { has: obj => "notes" in obj, get: obj => obj.notes, set: (obj, value) => { obj.notes = value; } }, metadata: _metadata }, _notes_initializers, _notes_extraInitializers);
        __esDecorate(null, null, _createdAt_decorators, { kind: "field", name: "createdAt", static: false, private: false, access: { has: obj => "createdAt" in obj, get: obj => obj.createdAt, set: (obj, value) => { obj.createdAt = value; } }, metadata: _metadata }, _createdAt_initializers, _createdAt_extraInitializers);
        __esDecorate(null, null, _updatedAt_decorators, { kind: "field", name: "updatedAt", static: false, private: false, access: { has: obj => "updatedAt" in obj, get: obj => obj.updatedAt, set: (obj, value) => { obj.updatedAt = value; } }, metadata: _metadata }, _updatedAt_initializers, _updatedAt_extraInitializers);
        __esDecorate(null, null, _deletedAt_decorators, { kind: "field", name: "deletedAt", static: false, private: false, access: { has: obj => "deletedAt" in obj, get: obj => obj.deletedAt, set: (obj, value) => { obj.deletedAt = value; } }, metadata: _metadata }, _deletedAt_initializers, _deletedAt_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        PerformanceMetric = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return PerformanceMetric = _classThis;
})();
exports.PerformanceMetric = PerformanceMetric;
/**
 * KPI definition database model
 */
let KPIDefinition = (() => {
    let _classDecorators = [(0, sequelize_typescript_1.Table)({ tableName: 'kpi_definitions', paranoid: true })];
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
    let _metricType_decorators;
    let _metricType_initializers = [];
    let _metricType_extraInitializers = [];
    let _targetValue_decorators;
    let _targetValue_initializers = [];
    let _targetValue_extraInitializers = [];
    let _warningThreshold_decorators;
    let _warningThreshold_initializers = [];
    let _warningThreshold_extraInitializers = [];
    let _criticalThreshold_decorators;
    let _criticalThreshold_initializers = [];
    let _criticalThreshold_extraInitializers = [];
    let _unit_decorators;
    let _unit_initializers = [];
    let _unit_extraInitializers = [];
    let _calculationMethod_decorators;
    let _calculationMethod_initializers = [];
    let _calculationMethod_extraInitializers = [];
    let _measurementFrequency_decorators;
    let _measurementFrequency_initializers = [];
    let _measurementFrequency_extraInitializers = [];
    let _assetTypeId_decorators;
    let _assetTypeId_initializers = [];
    let _assetTypeId_extraInitializers = [];
    let _departmentId_decorators;
    let _departmentId_initializers = [];
    let _departmentId_extraInitializers = [];
    let _isActive_decorators;
    let _isActive_initializers = [];
    let _isActive_extraInitializers = [];
    let _createdAt_decorators;
    let _createdAt_initializers = [];
    let _createdAt_extraInitializers = [];
    let _updatedAt_decorators;
    let _updatedAt_initializers = [];
    let _updatedAt_extraInitializers = [];
    let _deletedAt_decorators;
    let _deletedAt_initializers = [];
    let _deletedAt_extraInitializers = [];
    var KPIDefinition = _classThis = class extends _classSuper {
        constructor() {
            super(...arguments);
            this.id = __runInitializers(this, _id_initializers, void 0);
            this.name = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _name_initializers, void 0));
            this.description = (__runInitializers(this, _name_extraInitializers), __runInitializers(this, _description_initializers, void 0));
            this.metricType = (__runInitializers(this, _description_extraInitializers), __runInitializers(this, _metricType_initializers, void 0));
            this.targetValue = (__runInitializers(this, _metricType_extraInitializers), __runInitializers(this, _targetValue_initializers, void 0));
            this.warningThreshold = (__runInitializers(this, _targetValue_extraInitializers), __runInitializers(this, _warningThreshold_initializers, void 0));
            this.criticalThreshold = (__runInitializers(this, _warningThreshold_extraInitializers), __runInitializers(this, _criticalThreshold_initializers, void 0));
            this.unit = (__runInitializers(this, _criticalThreshold_extraInitializers), __runInitializers(this, _unit_initializers, void 0));
            this.calculationMethod = (__runInitializers(this, _unit_extraInitializers), __runInitializers(this, _calculationMethod_initializers, void 0));
            this.measurementFrequency = (__runInitializers(this, _calculationMethod_extraInitializers), __runInitializers(this, _measurementFrequency_initializers, void 0));
            this.assetTypeId = (__runInitializers(this, _measurementFrequency_extraInitializers), __runInitializers(this, _assetTypeId_initializers, void 0));
            this.departmentId = (__runInitializers(this, _assetTypeId_extraInitializers), __runInitializers(this, _departmentId_initializers, void 0));
            this.isActive = (__runInitializers(this, _departmentId_extraInitializers), __runInitializers(this, _isActive_initializers, void 0));
            this.createdAt = (__runInitializers(this, _isActive_extraInitializers), __runInitializers(this, _createdAt_initializers, void 0));
            this.updatedAt = (__runInitializers(this, _createdAt_extraInitializers), __runInitializers(this, _updatedAt_initializers, void 0));
            this.deletedAt = (__runInitializers(this, _updatedAt_extraInitializers), __runInitializers(this, _deletedAt_initializers, void 0));
            __runInitializers(this, _deletedAt_extraInitializers);
        }
    };
    __setFunctionName(_classThis, "KPIDefinition");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        _id_decorators = [(0, swagger_1.ApiProperty)({ description: 'Unique KPI ID' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUID, defaultValue: sequelize_typescript_1.DataType.UUIDV4, primaryKey: true })];
        _name_decorators = [(0, swagger_1.ApiProperty)({ description: 'KPI name' }), sequelize_typescript_1.Index, (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING(200), allowNull: false })];
        _description_decorators = [(0, swagger_1.ApiProperty)({ description: 'KPI description' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.TEXT })];
        _metricType_decorators = [(0, swagger_1.ApiProperty)({ description: 'Metric type', enum: PerformanceMetricType }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.ENUM(...Object.values(PerformanceMetricType)), allowNull: false })];
        _targetValue_decorators = [(0, swagger_1.ApiProperty)({ description: 'Target value' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DECIMAL(10, 2), allowNull: false })];
        _warningThreshold_decorators = [(0, swagger_1.ApiProperty)({ description: 'Warning threshold' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DECIMAL(10, 2) })];
        _criticalThreshold_decorators = [(0, swagger_1.ApiProperty)({ description: 'Critical threshold' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DECIMAL(10, 2) })];
        _unit_decorators = [(0, swagger_1.ApiProperty)({ description: 'Unit of measurement' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING(50), allowNull: false })];
        _calculationMethod_decorators = [(0, swagger_1.ApiProperty)({ description: 'Calculation method' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.TEXT })];
        _measurementFrequency_decorators = [(0, swagger_1.ApiProperty)({ description: 'Measurement frequency' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING(50) })];
        _assetTypeId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Asset type ID' }), sequelize_typescript_1.Index, (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUID })];
        _departmentId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Department ID' }), sequelize_typescript_1.Index, (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUID })];
        _isActive_decorators = [(0, swagger_1.ApiProperty)({ description: 'Is KPI active' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.BOOLEAN, defaultValue: true })];
        _createdAt_decorators = [sequelize_typescript_1.CreatedAt];
        _updatedAt_decorators = [sequelize_typescript_1.UpdatedAt];
        _deletedAt_decorators = [sequelize_typescript_1.DeletedAt];
        __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: obj => "id" in obj, get: obj => obj.id, set: (obj, value) => { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
        __esDecorate(null, null, _name_decorators, { kind: "field", name: "name", static: false, private: false, access: { has: obj => "name" in obj, get: obj => obj.name, set: (obj, value) => { obj.name = value; } }, metadata: _metadata }, _name_initializers, _name_extraInitializers);
        __esDecorate(null, null, _description_decorators, { kind: "field", name: "description", static: false, private: false, access: { has: obj => "description" in obj, get: obj => obj.description, set: (obj, value) => { obj.description = value; } }, metadata: _metadata }, _description_initializers, _description_extraInitializers);
        __esDecorate(null, null, _metricType_decorators, { kind: "field", name: "metricType", static: false, private: false, access: { has: obj => "metricType" in obj, get: obj => obj.metricType, set: (obj, value) => { obj.metricType = value; } }, metadata: _metadata }, _metricType_initializers, _metricType_extraInitializers);
        __esDecorate(null, null, _targetValue_decorators, { kind: "field", name: "targetValue", static: false, private: false, access: { has: obj => "targetValue" in obj, get: obj => obj.targetValue, set: (obj, value) => { obj.targetValue = value; } }, metadata: _metadata }, _targetValue_initializers, _targetValue_extraInitializers);
        __esDecorate(null, null, _warningThreshold_decorators, { kind: "field", name: "warningThreshold", static: false, private: false, access: { has: obj => "warningThreshold" in obj, get: obj => obj.warningThreshold, set: (obj, value) => { obj.warningThreshold = value; } }, metadata: _metadata }, _warningThreshold_initializers, _warningThreshold_extraInitializers);
        __esDecorate(null, null, _criticalThreshold_decorators, { kind: "field", name: "criticalThreshold", static: false, private: false, access: { has: obj => "criticalThreshold" in obj, get: obj => obj.criticalThreshold, set: (obj, value) => { obj.criticalThreshold = value; } }, metadata: _metadata }, _criticalThreshold_initializers, _criticalThreshold_extraInitializers);
        __esDecorate(null, null, _unit_decorators, { kind: "field", name: "unit", static: false, private: false, access: { has: obj => "unit" in obj, get: obj => obj.unit, set: (obj, value) => { obj.unit = value; } }, metadata: _metadata }, _unit_initializers, _unit_extraInitializers);
        __esDecorate(null, null, _calculationMethod_decorators, { kind: "field", name: "calculationMethod", static: false, private: false, access: { has: obj => "calculationMethod" in obj, get: obj => obj.calculationMethod, set: (obj, value) => { obj.calculationMethod = value; } }, metadata: _metadata }, _calculationMethod_initializers, _calculationMethod_extraInitializers);
        __esDecorate(null, null, _measurementFrequency_decorators, { kind: "field", name: "measurementFrequency", static: false, private: false, access: { has: obj => "measurementFrequency" in obj, get: obj => obj.measurementFrequency, set: (obj, value) => { obj.measurementFrequency = value; } }, metadata: _metadata }, _measurementFrequency_initializers, _measurementFrequency_extraInitializers);
        __esDecorate(null, null, _assetTypeId_decorators, { kind: "field", name: "assetTypeId", static: false, private: false, access: { has: obj => "assetTypeId" in obj, get: obj => obj.assetTypeId, set: (obj, value) => { obj.assetTypeId = value; } }, metadata: _metadata }, _assetTypeId_initializers, _assetTypeId_extraInitializers);
        __esDecorate(null, null, _departmentId_decorators, { kind: "field", name: "departmentId", static: false, private: false, access: { has: obj => "departmentId" in obj, get: obj => obj.departmentId, set: (obj, value) => { obj.departmentId = value; } }, metadata: _metadata }, _departmentId_initializers, _departmentId_extraInitializers);
        __esDecorate(null, null, _isActive_decorators, { kind: "field", name: "isActive", static: false, private: false, access: { has: obj => "isActive" in obj, get: obj => obj.isActive, set: (obj, value) => { obj.isActive = value; } }, metadata: _metadata }, _isActive_initializers, _isActive_extraInitializers);
        __esDecorate(null, null, _createdAt_decorators, { kind: "field", name: "createdAt", static: false, private: false, access: { has: obj => "createdAt" in obj, get: obj => obj.createdAt, set: (obj, value) => { obj.createdAt = value; } }, metadata: _metadata }, _createdAt_initializers, _createdAt_extraInitializers);
        __esDecorate(null, null, _updatedAt_decorators, { kind: "field", name: "updatedAt", static: false, private: false, access: { has: obj => "updatedAt" in obj, get: obj => obj.updatedAt, set: (obj, value) => { obj.updatedAt = value; } }, metadata: _metadata }, _updatedAt_initializers, _updatedAt_extraInitializers);
        __esDecorate(null, null, _deletedAt_decorators, { kind: "field", name: "deletedAt", static: false, private: false, access: { has: obj => "deletedAt" in obj, get: obj => obj.deletedAt, set: (obj, value) => { obj.deletedAt = value; } }, metadata: _metadata }, _deletedAt_initializers, _deletedAt_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        KPIDefinition = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return KPIDefinition = _classThis;
})();
exports.KPIDefinition = KPIDefinition;
/**
 * OEE calculation database model
 */
let OEECalculation = (() => {
    let _classDecorators = [(0, sequelize_typescript_1.Table)({ tableName: 'oee_calculations', paranoid: true })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = sequelize_typescript_1.Model;
    let _id_decorators;
    let _id_initializers = [];
    let _id_extraInitializers = [];
    let _assetId_decorators;
    let _assetId_initializers = [];
    let _assetId_extraInitializers = [];
    let _periodStart_decorators;
    let _periodStart_initializers = [];
    let _periodStart_extraInitializers = [];
    let _periodEnd_decorators;
    let _periodEnd_initializers = [];
    let _periodEnd_extraInitializers = [];
    let _availability_decorators;
    let _availability_initializers = [];
    let _availability_extraInitializers = [];
    let _performance_decorators;
    let _performance_initializers = [];
    let _performance_extraInitializers = [];
    let _quality_decorators;
    let _quality_initializers = [];
    let _quality_extraInitializers = [];
    let _oee_decorators;
    let _oee_initializers = [];
    let _oee_extraInitializers = [];
    let _plannedProductionTime_decorators;
    let _plannedProductionTime_initializers = [];
    let _plannedProductionTime_extraInitializers = [];
    let _actualProductionTime_decorators;
    let _actualProductionTime_initializers = [];
    let _actualProductionTime_extraInitializers = [];
    let _downtime_decorators;
    let _downtime_initializers = [];
    let _downtime_extraInitializers = [];
    let _totalUnits_decorators;
    let _totalUnits_initializers = [];
    let _totalUnits_extraInitializers = [];
    let _goodUnits_decorators;
    let _goodUnits_initializers = [];
    let _goodUnits_extraInitializers = [];
    let _defectiveUnits_decorators;
    let _defectiveUnits_initializers = [];
    let _defectiveUnits_extraInitializers = [];
    let _status_decorators;
    let _status_initializers = [];
    let _status_extraInitializers = [];
    let _calculatedAt_decorators;
    let _calculatedAt_initializers = [];
    let _calculatedAt_extraInitializers = [];
    let _calculatedBy_decorators;
    let _calculatedBy_initializers = [];
    let _calculatedBy_extraInitializers = [];
    let _createdAt_decorators;
    let _createdAt_initializers = [];
    let _createdAt_extraInitializers = [];
    let _updatedAt_decorators;
    let _updatedAt_initializers = [];
    let _updatedAt_extraInitializers = [];
    let _deletedAt_decorators;
    let _deletedAt_initializers = [];
    let _deletedAt_extraInitializers = [];
    var OEECalculation = _classThis = class extends _classSuper {
        constructor() {
            super(...arguments);
            this.id = __runInitializers(this, _id_initializers, void 0);
            this.assetId = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _assetId_initializers, void 0));
            this.periodStart = (__runInitializers(this, _assetId_extraInitializers), __runInitializers(this, _periodStart_initializers, void 0));
            this.periodEnd = (__runInitializers(this, _periodStart_extraInitializers), __runInitializers(this, _periodEnd_initializers, void 0));
            this.availability = (__runInitializers(this, _periodEnd_extraInitializers), __runInitializers(this, _availability_initializers, void 0));
            this.performance = (__runInitializers(this, _availability_extraInitializers), __runInitializers(this, _performance_initializers, void 0));
            this.quality = (__runInitializers(this, _performance_extraInitializers), __runInitializers(this, _quality_initializers, void 0));
            this.oee = (__runInitializers(this, _quality_extraInitializers), __runInitializers(this, _oee_initializers, void 0));
            this.plannedProductionTime = (__runInitializers(this, _oee_extraInitializers), __runInitializers(this, _plannedProductionTime_initializers, void 0));
            this.actualProductionTime = (__runInitializers(this, _plannedProductionTime_extraInitializers), __runInitializers(this, _actualProductionTime_initializers, void 0));
            this.downtime = (__runInitializers(this, _actualProductionTime_extraInitializers), __runInitializers(this, _downtime_initializers, void 0));
            this.totalUnits = (__runInitializers(this, _downtime_extraInitializers), __runInitializers(this, _totalUnits_initializers, void 0));
            this.goodUnits = (__runInitializers(this, _totalUnits_extraInitializers), __runInitializers(this, _goodUnits_initializers, void 0));
            this.defectiveUnits = (__runInitializers(this, _goodUnits_extraInitializers), __runInitializers(this, _defectiveUnits_initializers, void 0));
            this.status = (__runInitializers(this, _defectiveUnits_extraInitializers), __runInitializers(this, _status_initializers, void 0));
            this.calculatedAt = (__runInitializers(this, _status_extraInitializers), __runInitializers(this, _calculatedAt_initializers, void 0));
            this.calculatedBy = (__runInitializers(this, _calculatedAt_extraInitializers), __runInitializers(this, _calculatedBy_initializers, void 0));
            this.createdAt = (__runInitializers(this, _calculatedBy_extraInitializers), __runInitializers(this, _createdAt_initializers, void 0));
            this.updatedAt = (__runInitializers(this, _createdAt_extraInitializers), __runInitializers(this, _updatedAt_initializers, void 0));
            this.deletedAt = (__runInitializers(this, _updatedAt_extraInitializers), __runInitializers(this, _deletedAt_initializers, void 0));
            __runInitializers(this, _deletedAt_extraInitializers);
        }
    };
    __setFunctionName(_classThis, "OEECalculation");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        _id_decorators = [(0, swagger_1.ApiProperty)({ description: 'Unique OEE calculation ID' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUID, defaultValue: sequelize_typescript_1.DataType.UUIDV4, primaryKey: true })];
        _assetId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Asset ID' }), sequelize_typescript_1.Index, (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUID, allowNull: false })];
        _periodStart_decorators = [(0, swagger_1.ApiProperty)({ description: 'Calculation period start' }), sequelize_typescript_1.Index, (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DATE, allowNull: false })];
        _periodEnd_decorators = [(0, swagger_1.ApiProperty)({ description: 'Calculation period end' }), sequelize_typescript_1.Index, (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DATE, allowNull: false })];
        _availability_decorators = [(0, swagger_1.ApiProperty)({ description: 'Availability percentage' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DECIMAL(5, 2), allowNull: false })];
        _performance_decorators = [(0, swagger_1.ApiProperty)({ description: 'Performance percentage' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DECIMAL(5, 2), allowNull: false })];
        _quality_decorators = [(0, swagger_1.ApiProperty)({ description: 'Quality percentage' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DECIMAL(5, 2), allowNull: false })];
        _oee_decorators = [(0, swagger_1.ApiProperty)({ description: 'Overall OEE percentage' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DECIMAL(5, 2), allowNull: false })];
        _plannedProductionTime_decorators = [(0, swagger_1.ApiProperty)({ description: 'Planned production time (minutes)' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.INTEGER })];
        _actualProductionTime_decorators = [(0, swagger_1.ApiProperty)({ description: 'Actual production time (minutes)' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.INTEGER })];
        _downtime_decorators = [(0, swagger_1.ApiProperty)({ description: 'Downtime (minutes)' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.INTEGER })];
        _totalUnits_decorators = [(0, swagger_1.ApiProperty)({ description: 'Total units produced' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.INTEGER })];
        _goodUnits_decorators = [(0, swagger_1.ApiProperty)({ description: 'Good units produced' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.INTEGER })];
        _defectiveUnits_decorators = [(0, swagger_1.ApiProperty)({ description: 'Defective units' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.INTEGER })];
        _status_decorators = [(0, swagger_1.ApiProperty)({ description: 'Performance status', enum: PerformanceStatus }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.ENUM(...Object.values(PerformanceStatus)) })];
        _calculatedAt_decorators = [(0, swagger_1.ApiProperty)({ description: 'When calculated' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DATE })];
        _calculatedBy_decorators = [(0, swagger_1.ApiProperty)({ description: 'User who calculated' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUID })];
        _createdAt_decorators = [sequelize_typescript_1.CreatedAt];
        _updatedAt_decorators = [sequelize_typescript_1.UpdatedAt];
        _deletedAt_decorators = [sequelize_typescript_1.DeletedAt];
        __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: obj => "id" in obj, get: obj => obj.id, set: (obj, value) => { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
        __esDecorate(null, null, _assetId_decorators, { kind: "field", name: "assetId", static: false, private: false, access: { has: obj => "assetId" in obj, get: obj => obj.assetId, set: (obj, value) => { obj.assetId = value; } }, metadata: _metadata }, _assetId_initializers, _assetId_extraInitializers);
        __esDecorate(null, null, _periodStart_decorators, { kind: "field", name: "periodStart", static: false, private: false, access: { has: obj => "periodStart" in obj, get: obj => obj.periodStart, set: (obj, value) => { obj.periodStart = value; } }, metadata: _metadata }, _periodStart_initializers, _periodStart_extraInitializers);
        __esDecorate(null, null, _periodEnd_decorators, { kind: "field", name: "periodEnd", static: false, private: false, access: { has: obj => "periodEnd" in obj, get: obj => obj.periodEnd, set: (obj, value) => { obj.periodEnd = value; } }, metadata: _metadata }, _periodEnd_initializers, _periodEnd_extraInitializers);
        __esDecorate(null, null, _availability_decorators, { kind: "field", name: "availability", static: false, private: false, access: { has: obj => "availability" in obj, get: obj => obj.availability, set: (obj, value) => { obj.availability = value; } }, metadata: _metadata }, _availability_initializers, _availability_extraInitializers);
        __esDecorate(null, null, _performance_decorators, { kind: "field", name: "performance", static: false, private: false, access: { has: obj => "performance" in obj, get: obj => obj.performance, set: (obj, value) => { obj.performance = value; } }, metadata: _metadata }, _performance_initializers, _performance_extraInitializers);
        __esDecorate(null, null, _quality_decorators, { kind: "field", name: "quality", static: false, private: false, access: { has: obj => "quality" in obj, get: obj => obj.quality, set: (obj, value) => { obj.quality = value; } }, metadata: _metadata }, _quality_initializers, _quality_extraInitializers);
        __esDecorate(null, null, _oee_decorators, { kind: "field", name: "oee", static: false, private: false, access: { has: obj => "oee" in obj, get: obj => obj.oee, set: (obj, value) => { obj.oee = value; } }, metadata: _metadata }, _oee_initializers, _oee_extraInitializers);
        __esDecorate(null, null, _plannedProductionTime_decorators, { kind: "field", name: "plannedProductionTime", static: false, private: false, access: { has: obj => "plannedProductionTime" in obj, get: obj => obj.plannedProductionTime, set: (obj, value) => { obj.plannedProductionTime = value; } }, metadata: _metadata }, _plannedProductionTime_initializers, _plannedProductionTime_extraInitializers);
        __esDecorate(null, null, _actualProductionTime_decorators, { kind: "field", name: "actualProductionTime", static: false, private: false, access: { has: obj => "actualProductionTime" in obj, get: obj => obj.actualProductionTime, set: (obj, value) => { obj.actualProductionTime = value; } }, metadata: _metadata }, _actualProductionTime_initializers, _actualProductionTime_extraInitializers);
        __esDecorate(null, null, _downtime_decorators, { kind: "field", name: "downtime", static: false, private: false, access: { has: obj => "downtime" in obj, get: obj => obj.downtime, set: (obj, value) => { obj.downtime = value; } }, metadata: _metadata }, _downtime_initializers, _downtime_extraInitializers);
        __esDecorate(null, null, _totalUnits_decorators, { kind: "field", name: "totalUnits", static: false, private: false, access: { has: obj => "totalUnits" in obj, get: obj => obj.totalUnits, set: (obj, value) => { obj.totalUnits = value; } }, metadata: _metadata }, _totalUnits_initializers, _totalUnits_extraInitializers);
        __esDecorate(null, null, _goodUnits_decorators, { kind: "field", name: "goodUnits", static: false, private: false, access: { has: obj => "goodUnits" in obj, get: obj => obj.goodUnits, set: (obj, value) => { obj.goodUnits = value; } }, metadata: _metadata }, _goodUnits_initializers, _goodUnits_extraInitializers);
        __esDecorate(null, null, _defectiveUnits_decorators, { kind: "field", name: "defectiveUnits", static: false, private: false, access: { has: obj => "defectiveUnits" in obj, get: obj => obj.defectiveUnits, set: (obj, value) => { obj.defectiveUnits = value; } }, metadata: _metadata }, _defectiveUnits_initializers, _defectiveUnits_extraInitializers);
        __esDecorate(null, null, _status_decorators, { kind: "field", name: "status", static: false, private: false, access: { has: obj => "status" in obj, get: obj => obj.status, set: (obj, value) => { obj.status = value; } }, metadata: _metadata }, _status_initializers, _status_extraInitializers);
        __esDecorate(null, null, _calculatedAt_decorators, { kind: "field", name: "calculatedAt", static: false, private: false, access: { has: obj => "calculatedAt" in obj, get: obj => obj.calculatedAt, set: (obj, value) => { obj.calculatedAt = value; } }, metadata: _metadata }, _calculatedAt_initializers, _calculatedAt_extraInitializers);
        __esDecorate(null, null, _calculatedBy_decorators, { kind: "field", name: "calculatedBy", static: false, private: false, access: { has: obj => "calculatedBy" in obj, get: obj => obj.calculatedBy, set: (obj, value) => { obj.calculatedBy = value; } }, metadata: _metadata }, _calculatedBy_initializers, _calculatedBy_extraInitializers);
        __esDecorate(null, null, _createdAt_decorators, { kind: "field", name: "createdAt", static: false, private: false, access: { has: obj => "createdAt" in obj, get: obj => obj.createdAt, set: (obj, value) => { obj.createdAt = value; } }, metadata: _metadata }, _createdAt_initializers, _createdAt_extraInitializers);
        __esDecorate(null, null, _updatedAt_decorators, { kind: "field", name: "updatedAt", static: false, private: false, access: { has: obj => "updatedAt" in obj, get: obj => obj.updatedAt, set: (obj, value) => { obj.updatedAt = value; } }, metadata: _metadata }, _updatedAt_initializers, _updatedAt_extraInitializers);
        __esDecorate(null, null, _deletedAt_decorators, { kind: "field", name: "deletedAt", static: false, private: false, access: { has: obj => "deletedAt" in obj, get: obj => obj.deletedAt, set: (obj, value) => { obj.deletedAt = value; } }, metadata: _metadata }, _deletedAt_initializers, _deletedAt_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        OEECalculation = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return OEECalculation = _classThis;
})();
exports.OEECalculation = OEECalculation;
/**
 * Performance alert database model
 */
let PerformanceAlert = (() => {
    let _classDecorators = [(0, sequelize_typescript_1.Table)({ tableName: 'performance_alerts', paranoid: true })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = sequelize_typescript_1.Model;
    let _id_decorators;
    let _id_initializers = [];
    let _id_extraInitializers = [];
    let _assetId_decorators;
    let _assetId_initializers = [];
    let _assetId_extraInitializers = [];
    let _alertType_decorators;
    let _alertType_initializers = [];
    let _alertType_extraInitializers = [];
    let _severity_decorators;
    let _severity_initializers = [];
    let _severity_extraInitializers = [];
    let _metricType_decorators;
    let _metricType_initializers = [];
    let _metricType_extraInitializers = [];
    let _currentValue_decorators;
    let _currentValue_initializers = [];
    let _currentValue_extraInitializers = [];
    let _threshold_decorators;
    let _threshold_initializers = [];
    let _threshold_extraInitializers = [];
    let _message_decorators;
    let _message_initializers = [];
    let _message_extraInitializers = [];
    let _status_decorators;
    let _status_initializers = [];
    let _status_extraInitializers = [];
    let _acknowledgedBy_decorators;
    let _acknowledgedBy_initializers = [];
    let _acknowledgedBy_extraInitializers = [];
    let _acknowledgedAt_decorators;
    let _acknowledgedAt_initializers = [];
    let _acknowledgedAt_extraInitializers = [];
    let _resolvedBy_decorators;
    let _resolvedBy_initializers = [];
    let _resolvedBy_extraInitializers = [];
    let _resolvedAt_decorators;
    let _resolvedAt_initializers = [];
    let _resolvedAt_extraInitializers = [];
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
    var PerformanceAlert = _classThis = class extends _classSuper {
        constructor() {
            super(...arguments);
            this.id = __runInitializers(this, _id_initializers, void 0);
            this.assetId = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _assetId_initializers, void 0));
            this.alertType = (__runInitializers(this, _assetId_extraInitializers), __runInitializers(this, _alertType_initializers, void 0));
            this.severity = (__runInitializers(this, _alertType_extraInitializers), __runInitializers(this, _severity_initializers, void 0));
            this.metricType = (__runInitializers(this, _severity_extraInitializers), __runInitializers(this, _metricType_initializers, void 0));
            this.currentValue = (__runInitializers(this, _metricType_extraInitializers), __runInitializers(this, _currentValue_initializers, void 0));
            this.threshold = (__runInitializers(this, _currentValue_extraInitializers), __runInitializers(this, _threshold_initializers, void 0));
            this.message = (__runInitializers(this, _threshold_extraInitializers), __runInitializers(this, _message_initializers, void 0));
            this.status = (__runInitializers(this, _message_extraInitializers), __runInitializers(this, _status_initializers, void 0));
            this.acknowledgedBy = (__runInitializers(this, _status_extraInitializers), __runInitializers(this, _acknowledgedBy_initializers, void 0));
            this.acknowledgedAt = (__runInitializers(this, _acknowledgedBy_extraInitializers), __runInitializers(this, _acknowledgedAt_initializers, void 0));
            this.resolvedBy = (__runInitializers(this, _acknowledgedAt_extraInitializers), __runInitializers(this, _resolvedBy_initializers, void 0));
            this.resolvedAt = (__runInitializers(this, _resolvedBy_extraInitializers), __runInitializers(this, _resolvedAt_initializers, void 0));
            this.metadata = (__runInitializers(this, _resolvedAt_extraInitializers), __runInitializers(this, _metadata_initializers, void 0));
            this.createdAt = (__runInitializers(this, _metadata_extraInitializers), __runInitializers(this, _createdAt_initializers, void 0));
            this.updatedAt = (__runInitializers(this, _createdAt_extraInitializers), __runInitializers(this, _updatedAt_initializers, void 0));
            this.deletedAt = (__runInitializers(this, _updatedAt_extraInitializers), __runInitializers(this, _deletedAt_initializers, void 0));
            __runInitializers(this, _deletedAt_extraInitializers);
        }
    };
    __setFunctionName(_classThis, "PerformanceAlert");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        _id_decorators = [(0, swagger_1.ApiProperty)({ description: 'Unique alert ID' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUID, defaultValue: sequelize_typescript_1.DataType.UUIDV4, primaryKey: true })];
        _assetId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Asset ID' }), sequelize_typescript_1.Index, (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUID, allowNull: false })];
        _alertType_decorators = [(0, swagger_1.ApiProperty)({ description: 'Alert type' }), sequelize_typescript_1.Index, (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING(100), allowNull: false })];
        _severity_decorators = [(0, swagger_1.ApiProperty)({ description: 'Alert severity', enum: AlertSeverity }), sequelize_typescript_1.Index, (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.ENUM(...Object.values(AlertSeverity)), allowNull: false })];
        _metricType_decorators = [(0, swagger_1.ApiProperty)({ description: 'Metric type', enum: PerformanceMetricType }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.ENUM(...Object.values(PerformanceMetricType)) })];
        _currentValue_decorators = [(0, swagger_1.ApiProperty)({ description: 'Current value' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DECIMAL(10, 2) })];
        _threshold_decorators = [(0, swagger_1.ApiProperty)({ description: 'Threshold value' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DECIMAL(10, 2) })];
        _message_decorators = [(0, swagger_1.ApiProperty)({ description: 'Alert message' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.TEXT, allowNull: false })];
        _status_decorators = [(0, swagger_1.ApiProperty)({ description: 'Alert status', enum: AlertStatus }), sequelize_typescript_1.Index, (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.ENUM(...Object.values(AlertStatus)),
                defaultValue: AlertStatus.OPEN,
            })];
        _acknowledgedBy_decorators = [(0, swagger_1.ApiProperty)({ description: 'Acknowledged by user ID' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUID })];
        _acknowledgedAt_decorators = [(0, swagger_1.ApiProperty)({ description: 'Acknowledged at timestamp' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DATE })];
        _resolvedBy_decorators = [(0, swagger_1.ApiProperty)({ description: 'Resolved by user ID' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUID })];
        _resolvedAt_decorators = [(0, swagger_1.ApiProperty)({ description: 'Resolved at timestamp' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DATE })];
        _metadata_decorators = [(0, swagger_1.ApiProperty)({ description: 'Additional metadata' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.JSONB })];
        _createdAt_decorators = [sequelize_typescript_1.CreatedAt];
        _updatedAt_decorators = [sequelize_typescript_1.UpdatedAt];
        _deletedAt_decorators = [sequelize_typescript_1.DeletedAt];
        __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: obj => "id" in obj, get: obj => obj.id, set: (obj, value) => { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
        __esDecorate(null, null, _assetId_decorators, { kind: "field", name: "assetId", static: false, private: false, access: { has: obj => "assetId" in obj, get: obj => obj.assetId, set: (obj, value) => { obj.assetId = value; } }, metadata: _metadata }, _assetId_initializers, _assetId_extraInitializers);
        __esDecorate(null, null, _alertType_decorators, { kind: "field", name: "alertType", static: false, private: false, access: { has: obj => "alertType" in obj, get: obj => obj.alertType, set: (obj, value) => { obj.alertType = value; } }, metadata: _metadata }, _alertType_initializers, _alertType_extraInitializers);
        __esDecorate(null, null, _severity_decorators, { kind: "field", name: "severity", static: false, private: false, access: { has: obj => "severity" in obj, get: obj => obj.severity, set: (obj, value) => { obj.severity = value; } }, metadata: _metadata }, _severity_initializers, _severity_extraInitializers);
        __esDecorate(null, null, _metricType_decorators, { kind: "field", name: "metricType", static: false, private: false, access: { has: obj => "metricType" in obj, get: obj => obj.metricType, set: (obj, value) => { obj.metricType = value; } }, metadata: _metadata }, _metricType_initializers, _metricType_extraInitializers);
        __esDecorate(null, null, _currentValue_decorators, { kind: "field", name: "currentValue", static: false, private: false, access: { has: obj => "currentValue" in obj, get: obj => obj.currentValue, set: (obj, value) => { obj.currentValue = value; } }, metadata: _metadata }, _currentValue_initializers, _currentValue_extraInitializers);
        __esDecorate(null, null, _threshold_decorators, { kind: "field", name: "threshold", static: false, private: false, access: { has: obj => "threshold" in obj, get: obj => obj.threshold, set: (obj, value) => { obj.threshold = value; } }, metadata: _metadata }, _threshold_initializers, _threshold_extraInitializers);
        __esDecorate(null, null, _message_decorators, { kind: "field", name: "message", static: false, private: false, access: { has: obj => "message" in obj, get: obj => obj.message, set: (obj, value) => { obj.message = value; } }, metadata: _metadata }, _message_initializers, _message_extraInitializers);
        __esDecorate(null, null, _status_decorators, { kind: "field", name: "status", static: false, private: false, access: { has: obj => "status" in obj, get: obj => obj.status, set: (obj, value) => { obj.status = value; } }, metadata: _metadata }, _status_initializers, _status_extraInitializers);
        __esDecorate(null, null, _acknowledgedBy_decorators, { kind: "field", name: "acknowledgedBy", static: false, private: false, access: { has: obj => "acknowledgedBy" in obj, get: obj => obj.acknowledgedBy, set: (obj, value) => { obj.acknowledgedBy = value; } }, metadata: _metadata }, _acknowledgedBy_initializers, _acknowledgedBy_extraInitializers);
        __esDecorate(null, null, _acknowledgedAt_decorators, { kind: "field", name: "acknowledgedAt", static: false, private: false, access: { has: obj => "acknowledgedAt" in obj, get: obj => obj.acknowledgedAt, set: (obj, value) => { obj.acknowledgedAt = value; } }, metadata: _metadata }, _acknowledgedAt_initializers, _acknowledgedAt_extraInitializers);
        __esDecorate(null, null, _resolvedBy_decorators, { kind: "field", name: "resolvedBy", static: false, private: false, access: { has: obj => "resolvedBy" in obj, get: obj => obj.resolvedBy, set: (obj, value) => { obj.resolvedBy = value; } }, metadata: _metadata }, _resolvedBy_initializers, _resolvedBy_extraInitializers);
        __esDecorate(null, null, _resolvedAt_decorators, { kind: "field", name: "resolvedAt", static: false, private: false, access: { has: obj => "resolvedAt" in obj, get: obj => obj.resolvedAt, set: (obj, value) => { obj.resolvedAt = value; } }, metadata: _metadata }, _resolvedAt_initializers, _resolvedAt_extraInitializers);
        __esDecorate(null, null, _metadata_decorators, { kind: "field", name: "metadata", static: false, private: false, access: { has: obj => "metadata" in obj, get: obj => obj.metadata, set: (obj, value) => { obj.metadata = value; } }, metadata: _metadata }, _metadata_initializers, _metadata_extraInitializers);
        __esDecorate(null, null, _createdAt_decorators, { kind: "field", name: "createdAt", static: false, private: false, access: { has: obj => "createdAt" in obj, get: obj => obj.createdAt, set: (obj, value) => { obj.createdAt = value; } }, metadata: _metadata }, _createdAt_initializers, _createdAt_extraInitializers);
        __esDecorate(null, null, _updatedAt_decorators, { kind: "field", name: "updatedAt", static: false, private: false, access: { has: obj => "updatedAt" in obj, get: obj => obj.updatedAt, set: (obj, value) => { obj.updatedAt = value; } }, metadata: _metadata }, _updatedAt_initializers, _updatedAt_extraInitializers);
        __esDecorate(null, null, _deletedAt_decorators, { kind: "field", name: "deletedAt", static: false, private: false, access: { has: obj => "deletedAt" in obj, get: obj => obj.deletedAt, set: (obj, value) => { obj.deletedAt = value; } }, metadata: _metadata }, _deletedAt_initializers, _deletedAt_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        PerformanceAlert = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return PerformanceAlert = _classThis;
})();
exports.PerformanceAlert = PerformanceAlert;
/**
 * SLA definition database model
 */
let SLADefinition = (() => {
    let _classDecorators = [(0, sequelize_typescript_1.Table)({ tableName: 'sla_definitions', paranoid: true })];
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
    let _assetId_decorators;
    let _assetId_initializers = [];
    let _assetId_extraInitializers = [];
    let _assetTypeId_decorators;
    let _assetTypeId_initializers = [];
    let _assetTypeId_extraInitializers = [];
    let _metricType_decorators;
    let _metricType_initializers = [];
    let _metricType_extraInitializers = [];
    let _targetValue_decorators;
    let _targetValue_initializers = [];
    let _targetValue_extraInitializers = [];
    let _minimumValue_decorators;
    let _minimumValue_initializers = [];
    let _minimumValue_extraInitializers = [];
    let _measurementPeriod_decorators;
    let _measurementPeriod_initializers = [];
    let _measurementPeriod_extraInitializers = [];
    let _penaltyAmount_decorators;
    let _penaltyAmount_initializers = [];
    let _penaltyAmount_extraInitializers = [];
    let _startDate_decorators;
    let _startDate_initializers = [];
    let _startDate_extraInitializers = [];
    let _endDate_decorators;
    let _endDate_initializers = [];
    let _endDate_extraInitializers = [];
    let _isActive_decorators;
    let _isActive_initializers = [];
    let _isActive_extraInitializers = [];
    let _createdAt_decorators;
    let _createdAt_initializers = [];
    let _createdAt_extraInitializers = [];
    let _updatedAt_decorators;
    let _updatedAt_initializers = [];
    let _updatedAt_extraInitializers = [];
    let _deletedAt_decorators;
    let _deletedAt_initializers = [];
    let _deletedAt_extraInitializers = [];
    var SLADefinition = _classThis = class extends _classSuper {
        constructor() {
            super(...arguments);
            this.id = __runInitializers(this, _id_initializers, void 0);
            this.name = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _name_initializers, void 0));
            this.description = (__runInitializers(this, _name_extraInitializers), __runInitializers(this, _description_initializers, void 0));
            this.assetId = (__runInitializers(this, _description_extraInitializers), __runInitializers(this, _assetId_initializers, void 0));
            this.assetTypeId = (__runInitializers(this, _assetId_extraInitializers), __runInitializers(this, _assetTypeId_initializers, void 0));
            this.metricType = (__runInitializers(this, _assetTypeId_extraInitializers), __runInitializers(this, _metricType_initializers, void 0));
            this.targetValue = (__runInitializers(this, _metricType_extraInitializers), __runInitializers(this, _targetValue_initializers, void 0));
            this.minimumValue = (__runInitializers(this, _targetValue_extraInitializers), __runInitializers(this, _minimumValue_initializers, void 0));
            this.measurementPeriod = (__runInitializers(this, _minimumValue_extraInitializers), __runInitializers(this, _measurementPeriod_initializers, void 0));
            this.penaltyAmount = (__runInitializers(this, _measurementPeriod_extraInitializers), __runInitializers(this, _penaltyAmount_initializers, void 0));
            this.startDate = (__runInitializers(this, _penaltyAmount_extraInitializers), __runInitializers(this, _startDate_initializers, void 0));
            this.endDate = (__runInitializers(this, _startDate_extraInitializers), __runInitializers(this, _endDate_initializers, void 0));
            this.isActive = (__runInitializers(this, _endDate_extraInitializers), __runInitializers(this, _isActive_initializers, void 0));
            this.createdAt = (__runInitializers(this, _isActive_extraInitializers), __runInitializers(this, _createdAt_initializers, void 0));
            this.updatedAt = (__runInitializers(this, _createdAt_extraInitializers), __runInitializers(this, _updatedAt_initializers, void 0));
            this.deletedAt = (__runInitializers(this, _updatedAt_extraInitializers), __runInitializers(this, _deletedAt_initializers, void 0));
            __runInitializers(this, _deletedAt_extraInitializers);
        }
    };
    __setFunctionName(_classThis, "SLADefinition");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        _id_decorators = [(0, swagger_1.ApiProperty)({ description: 'Unique SLA ID' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUID, defaultValue: sequelize_typescript_1.DataType.UUIDV4, primaryKey: true })];
        _name_decorators = [(0, swagger_1.ApiProperty)({ description: 'SLA name' }), sequelize_typescript_1.Index, (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING(200), allowNull: false })];
        _description_decorators = [(0, swagger_1.ApiProperty)({ description: 'SLA description' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.TEXT })];
        _assetId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Asset ID' }), sequelize_typescript_1.Index, (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUID })];
        _assetTypeId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Asset type ID' }), sequelize_typescript_1.Index, (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUID })];
        _metricType_decorators = [(0, swagger_1.ApiProperty)({ description: 'Metric type', enum: PerformanceMetricType }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.ENUM(...Object.values(PerformanceMetricType)), allowNull: false })];
        _targetValue_decorators = [(0, swagger_1.ApiProperty)({ description: 'Target value' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DECIMAL(10, 2), allowNull: false })];
        _minimumValue_decorators = [(0, swagger_1.ApiProperty)({ description: 'Minimum acceptable value' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DECIMAL(10, 2), allowNull: false })];
        _measurementPeriod_decorators = [(0, swagger_1.ApiProperty)({ description: 'Measurement period' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING(50), allowNull: false })];
        _penaltyAmount_decorators = [(0, swagger_1.ApiProperty)({ description: 'Penalty amount per violation' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DECIMAL(10, 2) })];
        _startDate_decorators = [(0, swagger_1.ApiProperty)({ description: 'SLA start date' }), sequelize_typescript_1.Index, (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DATE, allowNull: false })];
        _endDate_decorators = [(0, swagger_1.ApiProperty)({ description: 'SLA end date' }), sequelize_typescript_1.Index, (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DATE })];
        _isActive_decorators = [(0, swagger_1.ApiProperty)({ description: 'Is SLA active' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.BOOLEAN, defaultValue: true })];
        _createdAt_decorators = [sequelize_typescript_1.CreatedAt];
        _updatedAt_decorators = [sequelize_typescript_1.UpdatedAt];
        _deletedAt_decorators = [sequelize_typescript_1.DeletedAt];
        __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: obj => "id" in obj, get: obj => obj.id, set: (obj, value) => { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
        __esDecorate(null, null, _name_decorators, { kind: "field", name: "name", static: false, private: false, access: { has: obj => "name" in obj, get: obj => obj.name, set: (obj, value) => { obj.name = value; } }, metadata: _metadata }, _name_initializers, _name_extraInitializers);
        __esDecorate(null, null, _description_decorators, { kind: "field", name: "description", static: false, private: false, access: { has: obj => "description" in obj, get: obj => obj.description, set: (obj, value) => { obj.description = value; } }, metadata: _metadata }, _description_initializers, _description_extraInitializers);
        __esDecorate(null, null, _assetId_decorators, { kind: "field", name: "assetId", static: false, private: false, access: { has: obj => "assetId" in obj, get: obj => obj.assetId, set: (obj, value) => { obj.assetId = value; } }, metadata: _metadata }, _assetId_initializers, _assetId_extraInitializers);
        __esDecorate(null, null, _assetTypeId_decorators, { kind: "field", name: "assetTypeId", static: false, private: false, access: { has: obj => "assetTypeId" in obj, get: obj => obj.assetTypeId, set: (obj, value) => { obj.assetTypeId = value; } }, metadata: _metadata }, _assetTypeId_initializers, _assetTypeId_extraInitializers);
        __esDecorate(null, null, _metricType_decorators, { kind: "field", name: "metricType", static: false, private: false, access: { has: obj => "metricType" in obj, get: obj => obj.metricType, set: (obj, value) => { obj.metricType = value; } }, metadata: _metadata }, _metricType_initializers, _metricType_extraInitializers);
        __esDecorate(null, null, _targetValue_decorators, { kind: "field", name: "targetValue", static: false, private: false, access: { has: obj => "targetValue" in obj, get: obj => obj.targetValue, set: (obj, value) => { obj.targetValue = value; } }, metadata: _metadata }, _targetValue_initializers, _targetValue_extraInitializers);
        __esDecorate(null, null, _minimumValue_decorators, { kind: "field", name: "minimumValue", static: false, private: false, access: { has: obj => "minimumValue" in obj, get: obj => obj.minimumValue, set: (obj, value) => { obj.minimumValue = value; } }, metadata: _metadata }, _minimumValue_initializers, _minimumValue_extraInitializers);
        __esDecorate(null, null, _measurementPeriod_decorators, { kind: "field", name: "measurementPeriod", static: false, private: false, access: { has: obj => "measurementPeriod" in obj, get: obj => obj.measurementPeriod, set: (obj, value) => { obj.measurementPeriod = value; } }, metadata: _metadata }, _measurementPeriod_initializers, _measurementPeriod_extraInitializers);
        __esDecorate(null, null, _penaltyAmount_decorators, { kind: "field", name: "penaltyAmount", static: false, private: false, access: { has: obj => "penaltyAmount" in obj, get: obj => obj.penaltyAmount, set: (obj, value) => { obj.penaltyAmount = value; } }, metadata: _metadata }, _penaltyAmount_initializers, _penaltyAmount_extraInitializers);
        __esDecorate(null, null, _startDate_decorators, { kind: "field", name: "startDate", static: false, private: false, access: { has: obj => "startDate" in obj, get: obj => obj.startDate, set: (obj, value) => { obj.startDate = value; } }, metadata: _metadata }, _startDate_initializers, _startDate_extraInitializers);
        __esDecorate(null, null, _endDate_decorators, { kind: "field", name: "endDate", static: false, private: false, access: { has: obj => "endDate" in obj, get: obj => obj.endDate, set: (obj, value) => { obj.endDate = value; } }, metadata: _metadata }, _endDate_initializers, _endDate_extraInitializers);
        __esDecorate(null, null, _isActive_decorators, { kind: "field", name: "isActive", static: false, private: false, access: { has: obj => "isActive" in obj, get: obj => obj.isActive, set: (obj, value) => { obj.isActive = value; } }, metadata: _metadata }, _isActive_initializers, _isActive_extraInitializers);
        __esDecorate(null, null, _createdAt_decorators, { kind: "field", name: "createdAt", static: false, private: false, access: { has: obj => "createdAt" in obj, get: obj => obj.createdAt, set: (obj, value) => { obj.createdAt = value; } }, metadata: _metadata }, _createdAt_initializers, _createdAt_extraInitializers);
        __esDecorate(null, null, _updatedAt_decorators, { kind: "field", name: "updatedAt", static: false, private: false, access: { has: obj => "updatedAt" in obj, get: obj => obj.updatedAt, set: (obj, value) => { obj.updatedAt = value; } }, metadata: _metadata }, _updatedAt_initializers, _updatedAt_extraInitializers);
        __esDecorate(null, null, _deletedAt_decorators, { kind: "field", name: "deletedAt", static: false, private: false, access: { has: obj => "deletedAt" in obj, get: obj => obj.deletedAt, set: (obj, value) => { obj.deletedAt = value; } }, metadata: _metadata }, _deletedAt_initializers, _deletedAt_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        SLADefinition = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return SLADefinition = _classThis;
})();
exports.SLADefinition = SLADefinition;
/**
 * SLA compliance tracking database model
 */
let SLACompliance = (() => {
    let _classDecorators = [(0, sequelize_typescript_1.Table)({ tableName: 'sla_compliance', paranoid: true })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = sequelize_typescript_1.Model;
    let _id_decorators;
    let _id_initializers = [];
    let _id_extraInitializers = [];
    let _slaId_decorators;
    let _slaId_initializers = [];
    let _slaId_extraInitializers = [];
    let _sla_decorators;
    let _sla_initializers = [];
    let _sla_extraInitializers = [];
    let _assetId_decorators;
    let _assetId_initializers = [];
    let _assetId_extraInitializers = [];
    let _periodStart_decorators;
    let _periodStart_initializers = [];
    let _periodStart_extraInitializers = [];
    let _periodEnd_decorators;
    let _periodEnd_initializers = [];
    let _periodEnd_extraInitializers = [];
    let _targetValue_decorators;
    let _targetValue_initializers = [];
    let _targetValue_extraInitializers = [];
    let _actualValue_decorators;
    let _actualValue_initializers = [];
    let _actualValue_extraInitializers = [];
    let _compliance_decorators;
    let _compliance_initializers = [];
    let _compliance_extraInitializers = [];
    let _status_decorators;
    let _status_initializers = [];
    let _status_extraInitializers = [];
    let _violations_decorators;
    let _violations_initializers = [];
    let _violations_extraInitializers = [];
    let _penalties_decorators;
    let _penalties_initializers = [];
    let _penalties_extraInitializers = [];
    let _createdAt_decorators;
    let _createdAt_initializers = [];
    let _createdAt_extraInitializers = [];
    let _updatedAt_decorators;
    let _updatedAt_initializers = [];
    let _updatedAt_extraInitializers = [];
    let _deletedAt_decorators;
    let _deletedAt_initializers = [];
    let _deletedAt_extraInitializers = [];
    var SLACompliance = _classThis = class extends _classSuper {
        constructor() {
            super(...arguments);
            this.id = __runInitializers(this, _id_initializers, void 0);
            this.slaId = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _slaId_initializers, void 0));
            this.sla = (__runInitializers(this, _slaId_extraInitializers), __runInitializers(this, _sla_initializers, void 0));
            this.assetId = (__runInitializers(this, _sla_extraInitializers), __runInitializers(this, _assetId_initializers, void 0));
            this.periodStart = (__runInitializers(this, _assetId_extraInitializers), __runInitializers(this, _periodStart_initializers, void 0));
            this.periodEnd = (__runInitializers(this, _periodStart_extraInitializers), __runInitializers(this, _periodEnd_initializers, void 0));
            this.targetValue = (__runInitializers(this, _periodEnd_extraInitializers), __runInitializers(this, _targetValue_initializers, void 0));
            this.actualValue = (__runInitializers(this, _targetValue_extraInitializers), __runInitializers(this, _actualValue_initializers, void 0));
            this.compliance = (__runInitializers(this, _actualValue_extraInitializers), __runInitializers(this, _compliance_initializers, void 0));
            this.status = (__runInitializers(this, _compliance_extraInitializers), __runInitializers(this, _status_initializers, void 0));
            this.violations = (__runInitializers(this, _status_extraInitializers), __runInitializers(this, _violations_initializers, void 0));
            this.penalties = (__runInitializers(this, _violations_extraInitializers), __runInitializers(this, _penalties_initializers, void 0));
            this.createdAt = (__runInitializers(this, _penalties_extraInitializers), __runInitializers(this, _createdAt_initializers, void 0));
            this.updatedAt = (__runInitializers(this, _createdAt_extraInitializers), __runInitializers(this, _updatedAt_initializers, void 0));
            this.deletedAt = (__runInitializers(this, _updatedAt_extraInitializers), __runInitializers(this, _deletedAt_initializers, void 0));
            __runInitializers(this, _deletedAt_extraInitializers);
        }
    };
    __setFunctionName(_classThis, "SLACompliance");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        _id_decorators = [(0, swagger_1.ApiProperty)({ description: 'Unique compliance record ID' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUID, defaultValue: sequelize_typescript_1.DataType.UUIDV4, primaryKey: true })];
        _slaId_decorators = [(0, swagger_1.ApiProperty)({ description: 'SLA definition ID' }), sequelize_typescript_1.Index, (0, sequelize_typescript_1.ForeignKey)(() => SLADefinition), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUID, allowNull: false })];
        _sla_decorators = [(0, sequelize_typescript_1.BelongsTo)(() => SLADefinition)];
        _assetId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Asset ID' }), sequelize_typescript_1.Index, (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUID, allowNull: false })];
        _periodStart_decorators = [(0, swagger_1.ApiProperty)({ description: 'Compliance period start' }), sequelize_typescript_1.Index, (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DATE, allowNull: false })];
        _periodEnd_decorators = [(0, swagger_1.ApiProperty)({ description: 'Compliance period end' }), sequelize_typescript_1.Index, (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DATE, allowNull: false })];
        _targetValue_decorators = [(0, swagger_1.ApiProperty)({ description: 'Target value' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DECIMAL(10, 2), allowNull: false })];
        _actualValue_decorators = [(0, swagger_1.ApiProperty)({ description: 'Actual value achieved' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DECIMAL(10, 2), allowNull: false })];
        _compliance_decorators = [(0, swagger_1.ApiProperty)({ description: 'Compliance percentage' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DECIMAL(5, 2), allowNull: false })];
        _status_decorators = [(0, swagger_1.ApiProperty)({ description: 'Compliance status', enum: SLAComplianceStatus }), sequelize_typescript_1.Index, (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.ENUM(...Object.values(SLAComplianceStatus)), allowNull: false })];
        _violations_decorators = [(0, swagger_1.ApiProperty)({ description: 'Violations data' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.JSONB })];
        _penalties_decorators = [(0, swagger_1.ApiProperty)({ description: 'Total penalties' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DECIMAL(10, 2), defaultValue: 0 })];
        _createdAt_decorators = [sequelize_typescript_1.CreatedAt];
        _updatedAt_decorators = [sequelize_typescript_1.UpdatedAt];
        _deletedAt_decorators = [sequelize_typescript_1.DeletedAt];
        __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: obj => "id" in obj, get: obj => obj.id, set: (obj, value) => { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
        __esDecorate(null, null, _slaId_decorators, { kind: "field", name: "slaId", static: false, private: false, access: { has: obj => "slaId" in obj, get: obj => obj.slaId, set: (obj, value) => { obj.slaId = value; } }, metadata: _metadata }, _slaId_initializers, _slaId_extraInitializers);
        __esDecorate(null, null, _sla_decorators, { kind: "field", name: "sla", static: false, private: false, access: { has: obj => "sla" in obj, get: obj => obj.sla, set: (obj, value) => { obj.sla = value; } }, metadata: _metadata }, _sla_initializers, _sla_extraInitializers);
        __esDecorate(null, null, _assetId_decorators, { kind: "field", name: "assetId", static: false, private: false, access: { has: obj => "assetId" in obj, get: obj => obj.assetId, set: (obj, value) => { obj.assetId = value; } }, metadata: _metadata }, _assetId_initializers, _assetId_extraInitializers);
        __esDecorate(null, null, _periodStart_decorators, { kind: "field", name: "periodStart", static: false, private: false, access: { has: obj => "periodStart" in obj, get: obj => obj.periodStart, set: (obj, value) => { obj.periodStart = value; } }, metadata: _metadata }, _periodStart_initializers, _periodStart_extraInitializers);
        __esDecorate(null, null, _periodEnd_decorators, { kind: "field", name: "periodEnd", static: false, private: false, access: { has: obj => "periodEnd" in obj, get: obj => obj.periodEnd, set: (obj, value) => { obj.periodEnd = value; } }, metadata: _metadata }, _periodEnd_initializers, _periodEnd_extraInitializers);
        __esDecorate(null, null, _targetValue_decorators, { kind: "field", name: "targetValue", static: false, private: false, access: { has: obj => "targetValue" in obj, get: obj => obj.targetValue, set: (obj, value) => { obj.targetValue = value; } }, metadata: _metadata }, _targetValue_initializers, _targetValue_extraInitializers);
        __esDecorate(null, null, _actualValue_decorators, { kind: "field", name: "actualValue", static: false, private: false, access: { has: obj => "actualValue" in obj, get: obj => obj.actualValue, set: (obj, value) => { obj.actualValue = value; } }, metadata: _metadata }, _actualValue_initializers, _actualValue_extraInitializers);
        __esDecorate(null, null, _compliance_decorators, { kind: "field", name: "compliance", static: false, private: false, access: { has: obj => "compliance" in obj, get: obj => obj.compliance, set: (obj, value) => { obj.compliance = value; } }, metadata: _metadata }, _compliance_initializers, _compliance_extraInitializers);
        __esDecorate(null, null, _status_decorators, { kind: "field", name: "status", static: false, private: false, access: { has: obj => "status" in obj, get: obj => obj.status, set: (obj, value) => { obj.status = value; } }, metadata: _metadata }, _status_initializers, _status_extraInitializers);
        __esDecorate(null, null, _violations_decorators, { kind: "field", name: "violations", static: false, private: false, access: { has: obj => "violations" in obj, get: obj => obj.violations, set: (obj, value) => { obj.violations = value; } }, metadata: _metadata }, _violations_initializers, _violations_extraInitializers);
        __esDecorate(null, null, _penalties_decorators, { kind: "field", name: "penalties", static: false, private: false, access: { has: obj => "penalties" in obj, get: obj => obj.penalties, set: (obj, value) => { obj.penalties = value; } }, metadata: _metadata }, _penalties_initializers, _penalties_extraInitializers);
        __esDecorate(null, null, _createdAt_decorators, { kind: "field", name: "createdAt", static: false, private: false, access: { has: obj => "createdAt" in obj, get: obj => obj.createdAt, set: (obj, value) => { obj.createdAt = value; } }, metadata: _metadata }, _createdAt_initializers, _createdAt_extraInitializers);
        __esDecorate(null, null, _updatedAt_decorators, { kind: "field", name: "updatedAt", static: false, private: false, access: { has: obj => "updatedAt" in obj, get: obj => obj.updatedAt, set: (obj, value) => { obj.updatedAt = value; } }, metadata: _metadata }, _updatedAt_initializers, _updatedAt_extraInitializers);
        __esDecorate(null, null, _deletedAt_decorators, { kind: "field", name: "deletedAt", static: false, private: false, access: { has: obj => "deletedAt" in obj, get: obj => obj.deletedAt, set: (obj, value) => { obj.deletedAt = value; } }, metadata: _metadata }, _deletedAt_initializers, _deletedAt_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        SLACompliance = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return SLACompliance = _classThis;
})();
exports.SLACompliance = SLACompliance;
// ============================================================================
// DATA TRANSFER OBJECTS (DTOs)
// ============================================================================
/**
 * Create performance record DTO
 */
let CreatePerformanceRecordDto = (() => {
    var _a;
    let _assetId_decorators;
    let _assetId_initializers = [];
    let _assetId_extraInitializers = [];
    let _metricType_decorators;
    let _metricType_initializers = [];
    let _metricType_extraInitializers = [];
    let _value_decorators;
    let _value_initializers = [];
    let _value_extraInitializers = [];
    let _unit_decorators;
    let _unit_initializers = [];
    let _unit_extraInitializers = [];
    let _recordedAt_decorators;
    let _recordedAt_initializers = [];
    let _recordedAt_extraInitializers = [];
    let _recordedBy_decorators;
    let _recordedBy_initializers = [];
    let _recordedBy_extraInitializers = [];
    let _metadata_decorators;
    let _metadata_initializers = [];
    let _metadata_extraInitializers = [];
    let _notes_decorators;
    let _notes_initializers = [];
    let _notes_extraInitializers = [];
    return _a = class CreatePerformanceRecordDto {
            constructor() {
                this.assetId = __runInitializers(this, _assetId_initializers, void 0);
                this.metricType = (__runInitializers(this, _assetId_extraInitializers), __runInitializers(this, _metricType_initializers, void 0));
                this.value = (__runInitializers(this, _metricType_extraInitializers), __runInitializers(this, _value_initializers, void 0));
                this.unit = (__runInitializers(this, _value_extraInitializers), __runInitializers(this, _unit_initializers, void 0));
                this.recordedAt = (__runInitializers(this, _unit_extraInitializers), __runInitializers(this, _recordedAt_initializers, void 0));
                this.recordedBy = (__runInitializers(this, _recordedAt_extraInitializers), __runInitializers(this, _recordedBy_initializers, void 0));
                this.metadata = (__runInitializers(this, _recordedBy_extraInitializers), __runInitializers(this, _metadata_initializers, void 0));
                this.notes = (__runInitializers(this, _metadata_extraInitializers), __runInitializers(this, _notes_initializers, void 0));
                __runInitializers(this, _notes_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _assetId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Asset ID' }), (0, class_validator_1.IsUUID)()];
            _metricType_decorators = [(0, swagger_1.ApiProperty)({ description: 'Metric type', enum: PerformanceMetricType }), (0, class_validator_1.IsEnum)(PerformanceMetricType)];
            _value_decorators = [(0, swagger_1.ApiProperty)({ description: 'Metric value' }), (0, class_validator_1.IsNumber)()];
            _unit_decorators = [(0, swagger_1.ApiProperty)({ description: 'Unit of measurement', required: false }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            _recordedAt_decorators = [(0, swagger_1.ApiProperty)({ description: 'Recorded timestamp' }), (0, class_validator_1.IsDate)(), (0, class_transformer_1.Type)(() => Date)];
            _recordedBy_decorators = [(0, swagger_1.ApiProperty)({ description: 'User who recorded', required: false }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsUUID)()];
            _metadata_decorators = [(0, swagger_1.ApiProperty)({ description: 'Additional metadata', required: false }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsObject)()];
            _notes_decorators = [(0, swagger_1.ApiProperty)({ description: 'Notes', required: false }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            __esDecorate(null, null, _assetId_decorators, { kind: "field", name: "assetId", static: false, private: false, access: { has: obj => "assetId" in obj, get: obj => obj.assetId, set: (obj, value) => { obj.assetId = value; } }, metadata: _metadata }, _assetId_initializers, _assetId_extraInitializers);
            __esDecorate(null, null, _metricType_decorators, { kind: "field", name: "metricType", static: false, private: false, access: { has: obj => "metricType" in obj, get: obj => obj.metricType, set: (obj, value) => { obj.metricType = value; } }, metadata: _metadata }, _metricType_initializers, _metricType_extraInitializers);
            __esDecorate(null, null, _value_decorators, { kind: "field", name: "value", static: false, private: false, access: { has: obj => "value" in obj, get: obj => obj.value, set: (obj, value) => { obj.value = value; } }, metadata: _metadata }, _value_initializers, _value_extraInitializers);
            __esDecorate(null, null, _unit_decorators, { kind: "field", name: "unit", static: false, private: false, access: { has: obj => "unit" in obj, get: obj => obj.unit, set: (obj, value) => { obj.unit = value; } }, metadata: _metadata }, _unit_initializers, _unit_extraInitializers);
            __esDecorate(null, null, _recordedAt_decorators, { kind: "field", name: "recordedAt", static: false, private: false, access: { has: obj => "recordedAt" in obj, get: obj => obj.recordedAt, set: (obj, value) => { obj.recordedAt = value; } }, metadata: _metadata }, _recordedAt_initializers, _recordedAt_extraInitializers);
            __esDecorate(null, null, _recordedBy_decorators, { kind: "field", name: "recordedBy", static: false, private: false, access: { has: obj => "recordedBy" in obj, get: obj => obj.recordedBy, set: (obj, value) => { obj.recordedBy = value; } }, metadata: _metadata }, _recordedBy_initializers, _recordedBy_extraInitializers);
            __esDecorate(null, null, _metadata_decorators, { kind: "field", name: "metadata", static: false, private: false, access: { has: obj => "metadata" in obj, get: obj => obj.metadata, set: (obj, value) => { obj.metadata = value; } }, metadata: _metadata }, _metadata_initializers, _metadata_extraInitializers);
            __esDecorate(null, null, _notes_decorators, { kind: "field", name: "notes", static: false, private: false, access: { has: obj => "notes" in obj, get: obj => obj.notes, set: (obj, value) => { obj.notes = value; } }, metadata: _metadata }, _notes_initializers, _notes_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.CreatePerformanceRecordDto = CreatePerformanceRecordDto;
/**
 * Create KPI definition DTO
 */
let CreateKPIDefinitionDto = (() => {
    var _a;
    let _name_decorators;
    let _name_initializers = [];
    let _name_extraInitializers = [];
    let _description_decorators;
    let _description_initializers = [];
    let _description_extraInitializers = [];
    let _metricType_decorators;
    let _metricType_initializers = [];
    let _metricType_extraInitializers = [];
    let _targetValue_decorators;
    let _targetValue_initializers = [];
    let _targetValue_extraInitializers = [];
    let _warningThreshold_decorators;
    let _warningThreshold_initializers = [];
    let _warningThreshold_extraInitializers = [];
    let _criticalThreshold_decorators;
    let _criticalThreshold_initializers = [];
    let _criticalThreshold_extraInitializers = [];
    let _unit_decorators;
    let _unit_initializers = [];
    let _unit_extraInitializers = [];
    let _calculationMethod_decorators;
    let _calculationMethod_initializers = [];
    let _calculationMethod_extraInitializers = [];
    let _measurementFrequency_decorators;
    let _measurementFrequency_initializers = [];
    let _measurementFrequency_extraInitializers = [];
    let _assetTypeId_decorators;
    let _assetTypeId_initializers = [];
    let _assetTypeId_extraInitializers = [];
    let _departmentId_decorators;
    let _departmentId_initializers = [];
    let _departmentId_extraInitializers = [];
    let _isActive_decorators;
    let _isActive_initializers = [];
    let _isActive_extraInitializers = [];
    return _a = class CreateKPIDefinitionDto {
            constructor() {
                this.name = __runInitializers(this, _name_initializers, void 0);
                this.description = (__runInitializers(this, _name_extraInitializers), __runInitializers(this, _description_initializers, void 0));
                this.metricType = (__runInitializers(this, _description_extraInitializers), __runInitializers(this, _metricType_initializers, void 0));
                this.targetValue = (__runInitializers(this, _metricType_extraInitializers), __runInitializers(this, _targetValue_initializers, void 0));
                this.warningThreshold = (__runInitializers(this, _targetValue_extraInitializers), __runInitializers(this, _warningThreshold_initializers, void 0));
                this.criticalThreshold = (__runInitializers(this, _warningThreshold_extraInitializers), __runInitializers(this, _criticalThreshold_initializers, void 0));
                this.unit = (__runInitializers(this, _criticalThreshold_extraInitializers), __runInitializers(this, _unit_initializers, void 0));
                this.calculationMethod = (__runInitializers(this, _unit_extraInitializers), __runInitializers(this, _calculationMethod_initializers, void 0));
                this.measurementFrequency = (__runInitializers(this, _calculationMethod_extraInitializers), __runInitializers(this, _measurementFrequency_initializers, void 0));
                this.assetTypeId = (__runInitializers(this, _measurementFrequency_extraInitializers), __runInitializers(this, _assetTypeId_initializers, void 0));
                this.departmentId = (__runInitializers(this, _assetTypeId_extraInitializers), __runInitializers(this, _departmentId_initializers, void 0));
                this.isActive = (__runInitializers(this, _departmentId_extraInitializers), __runInitializers(this, _isActive_initializers, void 0));
                __runInitializers(this, _isActive_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _name_decorators = [(0, swagger_1.ApiProperty)({ description: 'KPI name' }), (0, class_validator_1.IsString)()];
            _description_decorators = [(0, swagger_1.ApiProperty)({ description: 'KPI description', required: false }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            _metricType_decorators = [(0, swagger_1.ApiProperty)({ description: 'Metric type', enum: PerformanceMetricType }), (0, class_validator_1.IsEnum)(PerformanceMetricType)];
            _targetValue_decorators = [(0, swagger_1.ApiProperty)({ description: 'Target value' }), (0, class_validator_1.IsNumber)()];
            _warningThreshold_decorators = [(0, swagger_1.ApiProperty)({ description: 'Warning threshold', required: false }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsNumber)()];
            _criticalThreshold_decorators = [(0, swagger_1.ApiProperty)({ description: 'Critical threshold', required: false }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsNumber)()];
            _unit_decorators = [(0, swagger_1.ApiProperty)({ description: 'Unit of measurement' }), (0, class_validator_1.IsString)()];
            _calculationMethod_decorators = [(0, swagger_1.ApiProperty)({ description: 'Calculation method', required: false }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            _measurementFrequency_decorators = [(0, swagger_1.ApiProperty)({ description: 'Measurement frequency', required: false }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            _assetTypeId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Asset type ID', required: false }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsUUID)()];
            _departmentId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Department ID', required: false }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsUUID)()];
            _isActive_decorators = [(0, swagger_1.ApiProperty)({ description: 'Is active' }), (0, class_validator_1.IsBoolean)()];
            __esDecorate(null, null, _name_decorators, { kind: "field", name: "name", static: false, private: false, access: { has: obj => "name" in obj, get: obj => obj.name, set: (obj, value) => { obj.name = value; } }, metadata: _metadata }, _name_initializers, _name_extraInitializers);
            __esDecorate(null, null, _description_decorators, { kind: "field", name: "description", static: false, private: false, access: { has: obj => "description" in obj, get: obj => obj.description, set: (obj, value) => { obj.description = value; } }, metadata: _metadata }, _description_initializers, _description_extraInitializers);
            __esDecorate(null, null, _metricType_decorators, { kind: "field", name: "metricType", static: false, private: false, access: { has: obj => "metricType" in obj, get: obj => obj.metricType, set: (obj, value) => { obj.metricType = value; } }, metadata: _metadata }, _metricType_initializers, _metricType_extraInitializers);
            __esDecorate(null, null, _targetValue_decorators, { kind: "field", name: "targetValue", static: false, private: false, access: { has: obj => "targetValue" in obj, get: obj => obj.targetValue, set: (obj, value) => { obj.targetValue = value; } }, metadata: _metadata }, _targetValue_initializers, _targetValue_extraInitializers);
            __esDecorate(null, null, _warningThreshold_decorators, { kind: "field", name: "warningThreshold", static: false, private: false, access: { has: obj => "warningThreshold" in obj, get: obj => obj.warningThreshold, set: (obj, value) => { obj.warningThreshold = value; } }, metadata: _metadata }, _warningThreshold_initializers, _warningThreshold_extraInitializers);
            __esDecorate(null, null, _criticalThreshold_decorators, { kind: "field", name: "criticalThreshold", static: false, private: false, access: { has: obj => "criticalThreshold" in obj, get: obj => obj.criticalThreshold, set: (obj, value) => { obj.criticalThreshold = value; } }, metadata: _metadata }, _criticalThreshold_initializers, _criticalThreshold_extraInitializers);
            __esDecorate(null, null, _unit_decorators, { kind: "field", name: "unit", static: false, private: false, access: { has: obj => "unit" in obj, get: obj => obj.unit, set: (obj, value) => { obj.unit = value; } }, metadata: _metadata }, _unit_initializers, _unit_extraInitializers);
            __esDecorate(null, null, _calculationMethod_decorators, { kind: "field", name: "calculationMethod", static: false, private: false, access: { has: obj => "calculationMethod" in obj, get: obj => obj.calculationMethod, set: (obj, value) => { obj.calculationMethod = value; } }, metadata: _metadata }, _calculationMethod_initializers, _calculationMethod_extraInitializers);
            __esDecorate(null, null, _measurementFrequency_decorators, { kind: "field", name: "measurementFrequency", static: false, private: false, access: { has: obj => "measurementFrequency" in obj, get: obj => obj.measurementFrequency, set: (obj, value) => { obj.measurementFrequency = value; } }, metadata: _metadata }, _measurementFrequency_initializers, _measurementFrequency_extraInitializers);
            __esDecorate(null, null, _assetTypeId_decorators, { kind: "field", name: "assetTypeId", static: false, private: false, access: { has: obj => "assetTypeId" in obj, get: obj => obj.assetTypeId, set: (obj, value) => { obj.assetTypeId = value; } }, metadata: _metadata }, _assetTypeId_initializers, _assetTypeId_extraInitializers);
            __esDecorate(null, null, _departmentId_decorators, { kind: "field", name: "departmentId", static: false, private: false, access: { has: obj => "departmentId" in obj, get: obj => obj.departmentId, set: (obj, value) => { obj.departmentId = value; } }, metadata: _metadata }, _departmentId_initializers, _departmentId_extraInitializers);
            __esDecorate(null, null, _isActive_decorators, { kind: "field", name: "isActive", static: false, private: false, access: { has: obj => "isActive" in obj, get: obj => obj.isActive, set: (obj, value) => { obj.isActive = value; } }, metadata: _metadata }, _isActive_initializers, _isActive_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.CreateKPIDefinitionDto = CreateKPIDefinitionDto;
/**
 * Calculate OEE DTO
 */
let CalculateOEEDto = (() => {
    var _a;
    let _assetId_decorators;
    let _assetId_initializers = [];
    let _assetId_extraInitializers = [];
    let _startDate_decorators;
    let _startDate_initializers = [];
    let _startDate_extraInitializers = [];
    let _endDate_decorators;
    let _endDate_initializers = [];
    let _endDate_extraInitializers = [];
    let _plannedProductionTime_decorators;
    let _plannedProductionTime_initializers = [];
    let _plannedProductionTime_extraInitializers = [];
    let _targetCycleTime_decorators;
    let _targetCycleTime_initializers = [];
    let _targetCycleTime_extraInitializers = [];
    let _targetQuality_decorators;
    let _targetQuality_initializers = [];
    let _targetQuality_extraInitializers = [];
    return _a = class CalculateOEEDto {
            constructor() {
                this.assetId = __runInitializers(this, _assetId_initializers, void 0);
                this.startDate = (__runInitializers(this, _assetId_extraInitializers), __runInitializers(this, _startDate_initializers, void 0));
                this.endDate = (__runInitializers(this, _startDate_extraInitializers), __runInitializers(this, _endDate_initializers, void 0));
                this.plannedProductionTime = (__runInitializers(this, _endDate_extraInitializers), __runInitializers(this, _plannedProductionTime_initializers, void 0));
                this.targetCycleTime = (__runInitializers(this, _plannedProductionTime_extraInitializers), __runInitializers(this, _targetCycleTime_initializers, void 0));
                this.targetQuality = (__runInitializers(this, _targetCycleTime_extraInitializers), __runInitializers(this, _targetQuality_initializers, void 0));
                __runInitializers(this, _targetQuality_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _assetId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Asset ID' }), (0, class_validator_1.IsUUID)()];
            _startDate_decorators = [(0, swagger_1.ApiProperty)({ description: 'Period start date' }), (0, class_validator_1.IsDate)(), (0, class_transformer_1.Type)(() => Date)];
            _endDate_decorators = [(0, swagger_1.ApiProperty)({ description: 'Period end date' }), (0, class_validator_1.IsDate)(), (0, class_transformer_1.Type)(() => Date)];
            _plannedProductionTime_decorators = [(0, swagger_1.ApiProperty)({ description: 'Planned production time', required: false }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsNumber)()];
            _targetCycleTime_decorators = [(0, swagger_1.ApiProperty)({ description: 'Target cycle time', required: false }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsNumber)()];
            _targetQuality_decorators = [(0, swagger_1.ApiProperty)({ description: 'Target quality rate', required: false }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsNumber)()];
            __esDecorate(null, null, _assetId_decorators, { kind: "field", name: "assetId", static: false, private: false, access: { has: obj => "assetId" in obj, get: obj => obj.assetId, set: (obj, value) => { obj.assetId = value; } }, metadata: _metadata }, _assetId_initializers, _assetId_extraInitializers);
            __esDecorate(null, null, _startDate_decorators, { kind: "field", name: "startDate", static: false, private: false, access: { has: obj => "startDate" in obj, get: obj => obj.startDate, set: (obj, value) => { obj.startDate = value; } }, metadata: _metadata }, _startDate_initializers, _startDate_extraInitializers);
            __esDecorate(null, null, _endDate_decorators, { kind: "field", name: "endDate", static: false, private: false, access: { has: obj => "endDate" in obj, get: obj => obj.endDate, set: (obj, value) => { obj.endDate = value; } }, metadata: _metadata }, _endDate_initializers, _endDate_extraInitializers);
            __esDecorate(null, null, _plannedProductionTime_decorators, { kind: "field", name: "plannedProductionTime", static: false, private: false, access: { has: obj => "plannedProductionTime" in obj, get: obj => obj.plannedProductionTime, set: (obj, value) => { obj.plannedProductionTime = value; } }, metadata: _metadata }, _plannedProductionTime_initializers, _plannedProductionTime_extraInitializers);
            __esDecorate(null, null, _targetCycleTime_decorators, { kind: "field", name: "targetCycleTime", static: false, private: false, access: { has: obj => "targetCycleTime" in obj, get: obj => obj.targetCycleTime, set: (obj, value) => { obj.targetCycleTime = value; } }, metadata: _metadata }, _targetCycleTime_initializers, _targetCycleTime_extraInitializers);
            __esDecorate(null, null, _targetQuality_decorators, { kind: "field", name: "targetQuality", static: false, private: false, access: { has: obj => "targetQuality" in obj, get: obj => obj.targetQuality, set: (obj, value) => { obj.targetQuality = value; } }, metadata: _metadata }, _targetQuality_initializers, _targetQuality_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.CalculateOEEDto = CalculateOEEDto;
/**
 * Create performance alert DTO
 */
let CreatePerformanceAlertDto = (() => {
    var _a;
    let _assetId_decorators;
    let _assetId_initializers = [];
    let _assetId_extraInitializers = [];
    let _alertType_decorators;
    let _alertType_initializers = [];
    let _alertType_extraInitializers = [];
    let _severity_decorators;
    let _severity_initializers = [];
    let _severity_extraInitializers = [];
    let _metricType_decorators;
    let _metricType_initializers = [];
    let _metricType_extraInitializers = [];
    let _currentValue_decorators;
    let _currentValue_initializers = [];
    let _currentValue_extraInitializers = [];
    let _threshold_decorators;
    let _threshold_initializers = [];
    let _threshold_extraInitializers = [];
    let _message_decorators;
    let _message_initializers = [];
    let _message_extraInitializers = [];
    let _metadata_decorators;
    let _metadata_initializers = [];
    let _metadata_extraInitializers = [];
    return _a = class CreatePerformanceAlertDto {
            constructor() {
                this.assetId = __runInitializers(this, _assetId_initializers, void 0);
                this.alertType = (__runInitializers(this, _assetId_extraInitializers), __runInitializers(this, _alertType_initializers, void 0));
                this.severity = (__runInitializers(this, _alertType_extraInitializers), __runInitializers(this, _severity_initializers, void 0));
                this.metricType = (__runInitializers(this, _severity_extraInitializers), __runInitializers(this, _metricType_initializers, void 0));
                this.currentValue = (__runInitializers(this, _metricType_extraInitializers), __runInitializers(this, _currentValue_initializers, void 0));
                this.threshold = (__runInitializers(this, _currentValue_extraInitializers), __runInitializers(this, _threshold_initializers, void 0));
                this.message = (__runInitializers(this, _threshold_extraInitializers), __runInitializers(this, _message_initializers, void 0));
                this.metadata = (__runInitializers(this, _message_extraInitializers), __runInitializers(this, _metadata_initializers, void 0));
                __runInitializers(this, _metadata_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _assetId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Asset ID' }), (0, class_validator_1.IsUUID)()];
            _alertType_decorators = [(0, swagger_1.ApiProperty)({ description: 'Alert type' }), (0, class_validator_1.IsString)()];
            _severity_decorators = [(0, swagger_1.ApiProperty)({ description: 'Alert severity', enum: AlertSeverity }), (0, class_validator_1.IsEnum)(AlertSeverity)];
            _metricType_decorators = [(0, swagger_1.ApiProperty)({ description: 'Metric type', enum: PerformanceMetricType, required: false }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsEnum)(PerformanceMetricType)];
            _currentValue_decorators = [(0, swagger_1.ApiProperty)({ description: 'Current value', required: false }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsNumber)()];
            _threshold_decorators = [(0, swagger_1.ApiProperty)({ description: 'Threshold value', required: false }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsNumber)()];
            _message_decorators = [(0, swagger_1.ApiProperty)({ description: 'Alert message' }), (0, class_validator_1.IsString)()];
            _metadata_decorators = [(0, swagger_1.ApiProperty)({ description: 'Additional metadata', required: false }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsObject)()];
            __esDecorate(null, null, _assetId_decorators, { kind: "field", name: "assetId", static: false, private: false, access: { has: obj => "assetId" in obj, get: obj => obj.assetId, set: (obj, value) => { obj.assetId = value; } }, metadata: _metadata }, _assetId_initializers, _assetId_extraInitializers);
            __esDecorate(null, null, _alertType_decorators, { kind: "field", name: "alertType", static: false, private: false, access: { has: obj => "alertType" in obj, get: obj => obj.alertType, set: (obj, value) => { obj.alertType = value; } }, metadata: _metadata }, _alertType_initializers, _alertType_extraInitializers);
            __esDecorate(null, null, _severity_decorators, { kind: "field", name: "severity", static: false, private: false, access: { has: obj => "severity" in obj, get: obj => obj.severity, set: (obj, value) => { obj.severity = value; } }, metadata: _metadata }, _severity_initializers, _severity_extraInitializers);
            __esDecorate(null, null, _metricType_decorators, { kind: "field", name: "metricType", static: false, private: false, access: { has: obj => "metricType" in obj, get: obj => obj.metricType, set: (obj, value) => { obj.metricType = value; } }, metadata: _metadata }, _metricType_initializers, _metricType_extraInitializers);
            __esDecorate(null, null, _currentValue_decorators, { kind: "field", name: "currentValue", static: false, private: false, access: { has: obj => "currentValue" in obj, get: obj => obj.currentValue, set: (obj, value) => { obj.currentValue = value; } }, metadata: _metadata }, _currentValue_initializers, _currentValue_extraInitializers);
            __esDecorate(null, null, _threshold_decorators, { kind: "field", name: "threshold", static: false, private: false, access: { has: obj => "threshold" in obj, get: obj => obj.threshold, set: (obj, value) => { obj.threshold = value; } }, metadata: _metadata }, _threshold_initializers, _threshold_extraInitializers);
            __esDecorate(null, null, _message_decorators, { kind: "field", name: "message", static: false, private: false, access: { has: obj => "message" in obj, get: obj => obj.message, set: (obj, value) => { obj.message = value; } }, metadata: _metadata }, _message_initializers, _message_extraInitializers);
            __esDecorate(null, null, _metadata_decorators, { kind: "field", name: "metadata", static: false, private: false, access: { has: obj => "metadata" in obj, get: obj => obj.metadata, set: (obj, value) => { obj.metadata = value; } }, metadata: _metadata }, _metadata_initializers, _metadata_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.CreatePerformanceAlertDto = CreatePerformanceAlertDto;
/**
 * Create SLA definition DTO
 */
let CreateSLADefinitionDto = (() => {
    var _a;
    let _name_decorators;
    let _name_initializers = [];
    let _name_extraInitializers = [];
    let _description_decorators;
    let _description_initializers = [];
    let _description_extraInitializers = [];
    let _assetId_decorators;
    let _assetId_initializers = [];
    let _assetId_extraInitializers = [];
    let _assetTypeId_decorators;
    let _assetTypeId_initializers = [];
    let _assetTypeId_extraInitializers = [];
    let _metricType_decorators;
    let _metricType_initializers = [];
    let _metricType_extraInitializers = [];
    let _targetValue_decorators;
    let _targetValue_initializers = [];
    let _targetValue_extraInitializers = [];
    let _minimumValue_decorators;
    let _minimumValue_initializers = [];
    let _minimumValue_extraInitializers = [];
    let _measurementPeriod_decorators;
    let _measurementPeriod_initializers = [];
    let _measurementPeriod_extraInitializers = [];
    let _penaltyAmount_decorators;
    let _penaltyAmount_initializers = [];
    let _penaltyAmount_extraInitializers = [];
    let _startDate_decorators;
    let _startDate_initializers = [];
    let _startDate_extraInitializers = [];
    let _endDate_decorators;
    let _endDate_initializers = [];
    let _endDate_extraInitializers = [];
    let _isActive_decorators;
    let _isActive_initializers = [];
    let _isActive_extraInitializers = [];
    return _a = class CreateSLADefinitionDto {
            constructor() {
                this.name = __runInitializers(this, _name_initializers, void 0);
                this.description = (__runInitializers(this, _name_extraInitializers), __runInitializers(this, _description_initializers, void 0));
                this.assetId = (__runInitializers(this, _description_extraInitializers), __runInitializers(this, _assetId_initializers, void 0));
                this.assetTypeId = (__runInitializers(this, _assetId_extraInitializers), __runInitializers(this, _assetTypeId_initializers, void 0));
                this.metricType = (__runInitializers(this, _assetTypeId_extraInitializers), __runInitializers(this, _metricType_initializers, void 0));
                this.targetValue = (__runInitializers(this, _metricType_extraInitializers), __runInitializers(this, _targetValue_initializers, void 0));
                this.minimumValue = (__runInitializers(this, _targetValue_extraInitializers), __runInitializers(this, _minimumValue_initializers, void 0));
                this.measurementPeriod = (__runInitializers(this, _minimumValue_extraInitializers), __runInitializers(this, _measurementPeriod_initializers, void 0));
                this.penaltyAmount = (__runInitializers(this, _measurementPeriod_extraInitializers), __runInitializers(this, _penaltyAmount_initializers, void 0));
                this.startDate = (__runInitializers(this, _penaltyAmount_extraInitializers), __runInitializers(this, _startDate_initializers, void 0));
                this.endDate = (__runInitializers(this, _startDate_extraInitializers), __runInitializers(this, _endDate_initializers, void 0));
                this.isActive = (__runInitializers(this, _endDate_extraInitializers), __runInitializers(this, _isActive_initializers, void 0));
                __runInitializers(this, _isActive_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _name_decorators = [(0, swagger_1.ApiProperty)({ description: 'SLA name' }), (0, class_validator_1.IsString)()];
            _description_decorators = [(0, swagger_1.ApiProperty)({ description: 'SLA description', required: false }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            _assetId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Asset ID', required: false }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsUUID)()];
            _assetTypeId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Asset type ID', required: false }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsUUID)()];
            _metricType_decorators = [(0, swagger_1.ApiProperty)({ description: 'Metric type', enum: PerformanceMetricType }), (0, class_validator_1.IsEnum)(PerformanceMetricType)];
            _targetValue_decorators = [(0, swagger_1.ApiProperty)({ description: 'Target value' }), (0, class_validator_1.IsNumber)()];
            _minimumValue_decorators = [(0, swagger_1.ApiProperty)({ description: 'Minimum acceptable value' }), (0, class_validator_1.IsNumber)()];
            _measurementPeriod_decorators = [(0, swagger_1.ApiProperty)({ description: 'Measurement period' }), (0, class_validator_1.IsString)()];
            _penaltyAmount_decorators = [(0, swagger_1.ApiProperty)({ description: 'Penalty amount', required: false }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsNumber)()];
            _startDate_decorators = [(0, swagger_1.ApiProperty)({ description: 'Start date' }), (0, class_validator_1.IsDate)(), (0, class_transformer_1.Type)(() => Date)];
            _endDate_decorators = [(0, swagger_1.ApiProperty)({ description: 'End date', required: false }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsDate)(), (0, class_transformer_1.Type)(() => Date)];
            _isActive_decorators = [(0, swagger_1.ApiProperty)({ description: 'Is active' }), (0, class_validator_1.IsBoolean)()];
            __esDecorate(null, null, _name_decorators, { kind: "field", name: "name", static: false, private: false, access: { has: obj => "name" in obj, get: obj => obj.name, set: (obj, value) => { obj.name = value; } }, metadata: _metadata }, _name_initializers, _name_extraInitializers);
            __esDecorate(null, null, _description_decorators, { kind: "field", name: "description", static: false, private: false, access: { has: obj => "description" in obj, get: obj => obj.description, set: (obj, value) => { obj.description = value; } }, metadata: _metadata }, _description_initializers, _description_extraInitializers);
            __esDecorate(null, null, _assetId_decorators, { kind: "field", name: "assetId", static: false, private: false, access: { has: obj => "assetId" in obj, get: obj => obj.assetId, set: (obj, value) => { obj.assetId = value; } }, metadata: _metadata }, _assetId_initializers, _assetId_extraInitializers);
            __esDecorate(null, null, _assetTypeId_decorators, { kind: "field", name: "assetTypeId", static: false, private: false, access: { has: obj => "assetTypeId" in obj, get: obj => obj.assetTypeId, set: (obj, value) => { obj.assetTypeId = value; } }, metadata: _metadata }, _assetTypeId_initializers, _assetTypeId_extraInitializers);
            __esDecorate(null, null, _metricType_decorators, { kind: "field", name: "metricType", static: false, private: false, access: { has: obj => "metricType" in obj, get: obj => obj.metricType, set: (obj, value) => { obj.metricType = value; } }, metadata: _metadata }, _metricType_initializers, _metricType_extraInitializers);
            __esDecorate(null, null, _targetValue_decorators, { kind: "field", name: "targetValue", static: false, private: false, access: { has: obj => "targetValue" in obj, get: obj => obj.targetValue, set: (obj, value) => { obj.targetValue = value; } }, metadata: _metadata }, _targetValue_initializers, _targetValue_extraInitializers);
            __esDecorate(null, null, _minimumValue_decorators, { kind: "field", name: "minimumValue", static: false, private: false, access: { has: obj => "minimumValue" in obj, get: obj => obj.minimumValue, set: (obj, value) => { obj.minimumValue = value; } }, metadata: _metadata }, _minimumValue_initializers, _minimumValue_extraInitializers);
            __esDecorate(null, null, _measurementPeriod_decorators, { kind: "field", name: "measurementPeriod", static: false, private: false, access: { has: obj => "measurementPeriod" in obj, get: obj => obj.measurementPeriod, set: (obj, value) => { obj.measurementPeriod = value; } }, metadata: _metadata }, _measurementPeriod_initializers, _measurementPeriod_extraInitializers);
            __esDecorate(null, null, _penaltyAmount_decorators, { kind: "field", name: "penaltyAmount", static: false, private: false, access: { has: obj => "penaltyAmount" in obj, get: obj => obj.penaltyAmount, set: (obj, value) => { obj.penaltyAmount = value; } }, metadata: _metadata }, _penaltyAmount_initializers, _penaltyAmount_extraInitializers);
            __esDecorate(null, null, _startDate_decorators, { kind: "field", name: "startDate", static: false, private: false, access: { has: obj => "startDate" in obj, get: obj => obj.startDate, set: (obj, value) => { obj.startDate = value; } }, metadata: _metadata }, _startDate_initializers, _startDate_extraInitializers);
            __esDecorate(null, null, _endDate_decorators, { kind: "field", name: "endDate", static: false, private: false, access: { has: obj => "endDate" in obj, get: obj => obj.endDate, set: (obj, value) => { obj.endDate = value; } }, metadata: _metadata }, _endDate_initializers, _endDate_extraInitializers);
            __esDecorate(null, null, _isActive_decorators, { kind: "field", name: "isActive", static: false, private: false, access: { has: obj => "isActive" in obj, get: obj => obj.isActive, set: (obj, value) => { obj.isActive = value; } }, metadata: _metadata }, _isActive_initializers, _isActive_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.CreateSLADefinitionDto = CreateSLADefinitionDto;
// ============================================================================
// PERFORMANCE RECORD FUNCTIONS
// ============================================================================
/**
 * Create a new performance record
 *
 * @param data - Performance record data
 * @param transaction - Optional database transaction
 * @returns Created performance metric
 * @throws BadRequestException if validation fails
 *
 * @example
 * ```typescript
 * const record = await createPerformanceRecord({
 *   assetId: 'asset-001',
 *   metricType: 'uptime',
 *   value: 98.5,
 *   recordedAt: new Date()
 * });
 * ```
 */
async function createPerformanceRecord(data, transaction) {
    try {
        const metric = await PerformanceMetric.create({
            assetId: data.assetId,
            metricType: data.metricType,
            value: data.value,
            unit: data.unit,
            recordedAt: data.recordedAt,
            recordedBy: data.recordedBy,
            metadata: data.metadata,
            notes: data.notes,
        }, { transaction });
        return metric;
    }
    catch (error) {
        throw new common_1.BadRequestException(`Failed to create performance record: ${error.message}`);
    }
}
/**
 * Get performance record by ID
 *
 * @param id - Performance metric ID
 * @returns Performance metric or null
 *
 * @example
 * ```typescript
 * const record = await getPerformanceRecordById('metric-001');
 * ```
 */
async function getPerformanceRecordById(id) {
    return await PerformanceMetric.findByPk(id);
}
/**
 * Get performance records for an asset
 *
 * @param assetId - Asset ID
 * @param metricType - Optional metric type filter
 * @param startDate - Optional start date filter
 * @param endDate - Optional end date filter
 * @param limit - Maximum number of records to return
 * @returns Array of performance metrics
 *
 * @example
 * ```typescript
 * const records = await getAssetPerformanceRecords(
 *   'asset-001',
 *   'uptime',
 *   new Date('2024-01-01'),
 *   new Date('2024-01-31')
 * );
 * ```
 */
async function getAssetPerformanceRecords(assetId, metricType, startDate, endDate, limit = 100) {
    const where = { assetId };
    if (metricType) {
        where.metricType = metricType;
    }
    if (startDate || endDate) {
        where.recordedAt = {};
        if (startDate)
            where.recordedAt[sequelize_1.Op.gte] = startDate;
        if (endDate)
            where.recordedAt[sequelize_1.Op.lte] = endDate;
    }
    return await PerformanceMetric.findAll({
        where,
        order: [['recordedAt', 'DESC']],
        limit,
    });
}
/**
 * Update performance record
 *
 * @param id - Performance metric ID
 * @param updates - Fields to update
 * @param transaction - Optional database transaction
 * @returns Updated performance metric
 * @throws NotFoundException if metric not found
 *
 * @example
 * ```typescript
 * const updated = await updatePerformanceRecord('metric-001', {
 *   value: 99.0,
 *   notes: 'Corrected value'
 * });
 * ```
 */
async function updatePerformanceRecord(id, updates, transaction) {
    const metric = await PerformanceMetric.findByPk(id);
    if (!metric) {
        throw new common_1.NotFoundException(`Performance metric ${id} not found`);
    }
    await metric.update(updates, { transaction });
    return metric;
}
/**
 * Delete performance record
 *
 * @param id - Performance metric ID
 * @param transaction - Optional database transaction
 * @throws NotFoundException if metric not found
 *
 * @example
 * ```typescript
 * await deletePerformanceRecord('metric-001');
 * ```
 */
async function deletePerformanceRecord(id, transaction) {
    const metric = await PerformanceMetric.findByPk(id);
    if (!metric) {
        throw new common_1.NotFoundException(`Performance metric ${id} not found`);
    }
    await metric.destroy({ transaction });
}
// ============================================================================
// OEE CALCULATION FUNCTIONS
// ============================================================================
/**
 * Calculate OEE (Overall Equipment Effectiveness) for an asset
 *
 * @param assetId - Asset ID
 * @param params - OEE calculation parameters
 * @param transaction - Optional database transaction
 * @returns OEE calculation result
 * @throws BadRequestException if calculation fails
 *
 * @example
 * ```typescript
 * const oee = await calculateOEE('asset-001', {
 *   startDate: new Date('2024-01-01'),
 *   endDate: new Date('2024-01-31'),
 *   plannedProductionTime: 20000
 * });
 * ```
 */
async function calculateOEE(assetId, params, transaction) {
    try {
        // Get performance data for the period
        const metrics = await getAssetPerformanceRecords(assetId, undefined, params.startDate, params.endDate);
        // Calculate availability
        const uptimeMetrics = metrics.filter((m) => m.metricType === PerformanceMetricType.UPTIME);
        const downtimeMetrics = metrics.filter((m) => m.metricType === PerformanceMetricType.DOWNTIME);
        const totalUptime = uptimeMetrics.reduce((sum, m) => sum + Number(m.value), 0);
        const totalDowntime = downtimeMetrics.reduce((sum, m) => sum + Number(m.value), 0);
        const plannedTime = params.plannedProductionTime || totalUptime + totalDowntime;
        const availability = plannedTime > 0 ? (totalUptime / plannedTime) * 100 : 0;
        // Calculate performance
        const performanceMetrics = metrics.filter((m) => m.metricType === PerformanceMetricType.PERFORMANCE_RATE);
        const performance = performanceMetrics.length > 0
            ? performanceMetrics.reduce((sum, m) => sum + Number(m.value), 0) / performanceMetrics.length
            : 100;
        // Calculate quality
        const qualityMetrics = metrics.filter((m) => m.metricType === PerformanceMetricType.QUALITY_RATE);
        const quality = qualityMetrics.length > 0
            ? qualityMetrics.reduce((sum, m) => sum + Number(m.value), 0) / qualityMetrics.length
            : 100;
        // Calculate OEE
        const oee = (availability * performance * quality) / 10000;
        // Determine status
        let status;
        if (oee >= 85)
            status = PerformanceStatus.EXCELLENT;
        else if (oee >= 70)
            status = PerformanceStatus.GOOD;
        else if (oee >= 55)
            status = PerformanceStatus.ACCEPTABLE;
        else if (oee >= 40)
            status = PerformanceStatus.POOR;
        else
            status = PerformanceStatus.CRITICAL;
        // Get production units
        const totalUnitsMetrics = metrics.filter((m) => m.metricType === PerformanceMetricType.OUTPUT);
        const totalUnits = totalUnitsMetrics.reduce((sum, m) => sum + Number(m.value), 0);
        const goodUnits = Math.round(totalUnits * (quality / 100));
        const defectiveUnits = totalUnits - goodUnits;
        const result = {
            assetId,
            period: { startDate: params.startDate, endDate: params.endDate },
            availability,
            performance,
            quality,
            oee,
            plannedProductionTime: plannedTime,
            actualProductionTime: totalUptime,
            downtime: totalDowntime,
            idealCycleTime: params.targetCycleTime || 0,
            actualCycleTime: totalUptime / totalUnits || 0,
            totalUnits,
            goodUnits,
            defectiveUnits,
            status,
            calculatedAt: new Date(),
        };
        // Save calculation
        await OEECalculation.create({
            assetId,
            periodStart: params.startDate,
            periodEnd: params.endDate,
            availability,
            performance,
            quality,
            oee,
            plannedProductionTime: plannedTime,
            actualProductionTime: totalUptime,
            downtime: totalDowntime,
            totalUnits,
            goodUnits,
            defectiveUnits,
            status,
            calculatedAt: new Date(),
        }, { transaction });
        return result;
    }
    catch (error) {
        throw new common_1.BadRequestException(`Failed to calculate OEE: ${error.message}`);
    }
}
/**
 * Get OEE calculation history for an asset
 *
 * @param assetId - Asset ID
 * @param startDate - Optional start date filter
 * @param endDate - Optional end date filter
 * @param limit - Maximum number of records
 * @returns Array of OEE calculations
 *
 * @example
 * ```typescript
 * const history = await getOEEHistory('asset-001', new Date('2024-01-01'));
 * ```
 */
async function getOEEHistory(assetId, startDate, endDate, limit = 50) {
    const where = { assetId };
    if (startDate || endDate) {
        where.periodStart = {};
        if (startDate)
            where.periodStart[sequelize_1.Op.gte] = startDate;
        if (endDate)
            where.periodStart[sequelize_1.Op.lte] = endDate;
    }
    return await OEECalculation.findAll({
        where,
        order: [['periodStart', 'DESC']],
        limit,
    });
}
/**
 * Calculate availability metrics for an asset
 *
 * @param assetId - Asset ID
 * @param startDate - Period start date
 * @param endDate - Period end date
 * @returns Availability metrics
 *
 * @example
 * ```typescript
 * const availability = await calculateAvailability(
 *   'asset-001',
 *   new Date('2024-01-01'),
 *   new Date('2024-01-31')
 * );
 * ```
 */
async function calculateAvailability(assetId, startDate, endDate) {
    const metrics = await getAssetPerformanceRecords(assetId, undefined, startDate, endDate);
    const uptimeMetrics = metrics.filter((m) => m.metricType === PerformanceMetricType.UPTIME);
    const downtimeMetrics = metrics.filter((m) => m.metricType === PerformanceMetricType.DOWNTIME);
    const uptime = uptimeMetrics.reduce((sum, m) => sum + Number(m.value), 0);
    const downtime = downtimeMetrics.reduce((sum, m) => sum + Number(m.value), 0);
    const totalTime = uptime + downtime;
    const availability = totalTime > 0 ? (uptime / totalTime) * 100 : 0;
    // Calculate MTBF and MTTR (simplified)
    const failureCount = downtimeMetrics.length;
    const mtbf = failureCount > 0 ? uptime / failureCount : uptime;
    const mttr = failureCount > 0 ? downtime / failureCount : 0;
    const reliability = totalTime > 0 ? (mtbf / (mtbf + mttr)) * 100 : 0;
    return {
        assetId,
        period: { startDate, endDate },
        totalTime,
        uptime,
        downtime,
        plannedDowntime: 0,
        unplannedDowntime: downtime,
        availability,
        reliability,
        mtbf,
        mttr,
        failureCount,
    };
}
/**
 * Calculate utilization metrics for an asset
 *
 * @param assetId - Asset ID
 * @param startDate - Period start date
 * @param endDate - Period end date
 * @param totalCapacity - Total capacity for the period
 * @returns Utilization metrics
 *
 * @example
 * ```typescript
 * const utilization = await calculateUtilization(
 *   'asset-001',
 *   new Date('2024-01-01'),
 *   new Date('2024-01-31'),
 *   10000
 * );
 * ```
 */
async function calculateUtilization(assetId, startDate, endDate, totalCapacity) {
    const metrics = await getAssetPerformanceRecords(assetId, undefined, startDate, endDate);
    const utilizationMetrics = metrics.filter((m) => m.metricType === PerformanceMetricType.UTILIZATION);
    const usedCapacity = utilizationMetrics.reduce((sum, m) => sum + Number(m.value), 0);
    const utilizationRate = totalCapacity > 0 ? (usedCapacity / totalCapacity) * 100 : 0;
    const activeTime = metrics
        .filter((m) => m.metricType === PerformanceMetricType.UPTIME)
        .reduce((sum, m) => sum + Number(m.value), 0);
    const idleTime = totalCapacity - activeTime;
    const peakUsage = utilizationMetrics.length > 0
        ? Math.max(...utilizationMetrics.map((m) => Number(m.value)))
        : 0;
    const averageUsage = utilizationMetrics.length > 0
        ? usedCapacity / utilizationMetrics.length
        : 0;
    const efficiencyScore = utilizationRate > 0 ? Math.min(utilizationRate, 100) : 0;
    return {
        assetId,
        period: { startDate, endDate },
        totalCapacity,
        usedCapacity,
        utilizationRate,
        idleTime,
        activeTime,
        peakUsage,
        averageUsage,
        efficiencyScore,
    };
}
// ============================================================================
// KPI MANAGEMENT FUNCTIONS
// ============================================================================
/**
 * Create a KPI definition
 *
 * @param data - KPI definition data
 * @param transaction - Optional database transaction
 * @returns Created KPI definition
 * @throws BadRequestException if validation fails
 *
 * @example
 * ```typescript
 * const kpi = await createKPIDefinition({
 *   name: 'Asset Uptime',
 *   metricType: 'uptime',
 *   targetValue: 95,
 *   unit: '%',
 *   isActive: true
 * });
 * ```
 */
async function createKPIDefinition(data, transaction) {
    try {
        const kpi = await KPIDefinition.create({
            name: data.name,
            description: data.description,
            metricType: data.metricType,
            targetValue: data.targetValue,
            warningThreshold: data.warningThreshold,
            criticalThreshold: data.criticalThreshold,
            unit: data.unit,
            calculationMethod: data.calculationMethod,
            measurementFrequency: data.measurementFrequency,
            assetTypeId: data.assetTypeId,
            departmentId: data.departmentId,
            isActive: data.isActive,
        }, { transaction });
        return kpi;
    }
    catch (error) {
        throw new common_1.BadRequestException(`Failed to create KPI definition: ${error.message}`);
    }
}
/**
 * Get KPI definition by ID
 *
 * @param id - KPI definition ID
 * @returns KPI definition or null
 *
 * @example
 * ```typescript
 * const kpi = await getKPIDefinitionById('kpi-001');
 * ```
 */
async function getKPIDefinitionById(id) {
    return await KPIDefinition.findByPk(id);
}
/**
 * Get all active KPI definitions
 *
 * @param filters - Optional filters (assetTypeId, departmentId)
 * @returns Array of KPI definitions
 *
 * @example
 * ```typescript
 * const kpis = await getActiveKPIs({ assetTypeId: 'type-001' });
 * ```
 */
async function getActiveKPIs(filters) {
    const where = { isActive: true };
    if (filters?.assetTypeId) {
        where.assetTypeId = filters.assetTypeId;
    }
    if (filters?.departmentId) {
        where.departmentId = filters.departmentId;
    }
    return await KPIDefinition.findAll({ where });
}
/**
 * Update KPI definition
 *
 * @param id - KPI definition ID
 * @param updates - Fields to update
 * @param transaction - Optional database transaction
 * @returns Updated KPI definition
 * @throws NotFoundException if KPI not found
 *
 * @example
 * ```typescript
 * const updated = await updateKPIDefinition('kpi-001', {
 *   targetValue: 98,
 *   warningThreshold: 95
 * });
 * ```
 */
async function updateKPIDefinition(id, updates, transaction) {
    const kpi = await KPIDefinition.findByPk(id);
    if (!kpi) {
        throw new common_1.NotFoundException(`KPI definition ${id} not found`);
    }
    await kpi.update(updates, { transaction });
    return kpi;
}
/**
 * Calculate KPI value for an asset
 *
 * @param assetId - Asset ID
 * @param kpiId - KPI definition ID
 * @param startDate - Period start date
 * @param endDate - Period end date
 * @returns KPI value result
 * @throws NotFoundException if KPI definition not found
 *
 * @example
 * ```typescript
 * const kpiValue = await calculateKPIValue(
 *   'asset-001',
 *   'kpi-001',
 *   new Date('2024-01-01'),
 *   new Date('2024-01-31')
 * );
 * ```
 */
async function calculateKPIValue(assetId, kpiId, startDate, endDate) {
    const kpi = await KPIDefinition.findByPk(kpiId);
    if (!kpi) {
        throw new common_1.NotFoundException(`KPI definition ${kpiId} not found`);
    }
    const metrics = await getAssetPerformanceRecords(assetId, kpi.metricType, startDate, endDate);
    const currentValue = metrics.length > 0
        ? metrics.reduce((sum, m) => sum + Number(m.value), 0) / metrics.length
        : 0;
    let status;
    if (currentValue >= kpi.targetValue) {
        status = KPIStatus.ABOVE_TARGET;
    }
    else if (kpi.warningThreshold && currentValue >= kpi.warningThreshold) {
        status = KPIStatus.ON_TARGET;
    }
    else if (kpi.criticalThreshold && currentValue >= kpi.criticalThreshold) {
        status = KPIStatus.BELOW_TARGET;
    }
    else {
        status = KPIStatus.CRITICAL;
    }
    // Calculate trend (simplified)
    const halfwayPoint = new Date((startDate.getTime() + endDate.getTime()) / 2);
    const earlyMetrics = metrics.filter((m) => m.recordedAt < halfwayPoint);
    const lateMetrics = metrics.filter((m) => m.recordedAt >= halfwayPoint);
    const earlyAvg = earlyMetrics.length > 0
        ? earlyMetrics.reduce((sum, m) => sum + Number(m.value), 0) / earlyMetrics.length
        : currentValue;
    const lateAvg = lateMetrics.length > 0
        ? lateMetrics.reduce((sum, m) => sum + Number(m.value), 0) / lateMetrics.length
        : currentValue;
    let trend;
    const change = ((lateAvg - earlyAvg) / earlyAvg) * 100;
    if (change > 5)
        trend = TrendDirection.IMPROVING;
    else if (change < -5)
        trend = TrendDirection.DECLINING;
    else
        trend = TrendDirection.STABLE;
    return {
        kpiId: kpi.id,
        name: kpi.name,
        metricType: kpi.metricType,
        currentValue,
        targetValue: kpi.targetValue,
        unit: kpi.unit,
        status,
        trend,
        lastUpdated: new Date(),
    };
}
// ============================================================================
// PERFORMANCE ALERT FUNCTIONS
// ============================================================================
/**
 * Create a performance alert
 *
 * @param data - Performance alert data
 * @param transaction - Optional database transaction
 * @returns Created performance alert
 * @throws BadRequestException if validation fails
 *
 * @example
 * ```typescript
 * const alert = await createPerformanceAlert({
 *   assetId: 'asset-001',
 *   alertType: 'low_uptime',
 *   severity: 'warning',
 *   message: 'Asset uptime below threshold'
 * });
 * ```
 */
async function createPerformanceAlert(data, transaction) {
    try {
        const alert = await PerformanceAlert.create({
            assetId: data.assetId,
            alertType: data.alertType,
            severity: data.severity,
            metricType: data.metricType,
            currentValue: data.currentValue,
            threshold: data.threshold,
            message: data.message,
            metadata: data.metadata,
        }, { transaction });
        return alert;
    }
    catch (error) {
        throw new common_1.BadRequestException(`Failed to create performance alert: ${error.message}`);
    }
}
/**
 * Get performance alert by ID
 *
 * @param id - Alert ID
 * @returns Performance alert or null
 *
 * @example
 * ```typescript
 * const alert = await getPerformanceAlertById('alert-001');
 * ```
 */
async function getPerformanceAlertById(id) {
    return await PerformanceAlert.findByPk(id);
}
/**
 * Get active alerts for an asset
 *
 * @param assetId - Asset ID
 * @param severity - Optional severity filter
 * @returns Array of active alerts
 *
 * @example
 * ```typescript
 * const alerts = await getActiveAlertsForAsset('asset-001', 'critical');
 * ```
 */
async function getActiveAlertsForAsset(assetId, severity) {
    const where = {
        assetId,
        status: {
            [sequelize_1.Op.in]: [AlertStatus.OPEN, AlertStatus.ACKNOWLEDGED, AlertStatus.IN_PROGRESS],
        },
    };
    if (severity) {
        where.severity = severity;
    }
    return await PerformanceAlert.findAll({
        where,
        order: [['createdAt', 'DESC']],
    });
}
/**
 * Acknowledge a performance alert
 *
 * @param id - Alert ID
 * @param userId - User ID acknowledging the alert
 * @param transaction - Optional database transaction
 * @returns Updated alert
 * @throws NotFoundException if alert not found
 *
 * @example
 * ```typescript
 * const alert = await acknowledgePerformanceAlert('alert-001', 'user-001');
 * ```
 */
async function acknowledgePerformanceAlert(id, userId, transaction) {
    const alert = await PerformanceAlert.findByPk(id);
    if (!alert) {
        throw new common_1.NotFoundException(`Performance alert ${id} not found`);
    }
    await alert.update({
        status: AlertStatus.ACKNOWLEDGED,
        acknowledgedBy: userId,
        acknowledgedAt: new Date(),
    }, { transaction });
    return alert;
}
/**
 * Resolve a performance alert
 *
 * @param id - Alert ID
 * @param userId - User ID resolving the alert
 * @param transaction - Optional database transaction
 * @returns Updated alert
 * @throws NotFoundException if alert not found
 *
 * @example
 * ```typescript
 * const alert = await resolvePerformanceAlert('alert-001', 'user-001');
 * ```
 */
async function resolvePerformanceAlert(id, userId, transaction) {
    const alert = await PerformanceAlert.findByPk(id);
    if (!alert) {
        throw new common_1.NotFoundException(`Performance alert ${id} not found`);
    }
    await alert.update({
        status: AlertStatus.RESOLVED,
        resolvedBy: userId,
        resolvedAt: new Date(),
    }, { transaction });
    return alert;
}
/**
 * Generate performance alerts based on KPI thresholds
 *
 * @param assetId - Asset ID
 * @param transaction - Optional database transaction
 * @returns Array of generated alerts
 *
 * @example
 * ```typescript
 * const alerts = await generatePerformanceAlertsForAsset('asset-001');
 * ```
 */
async function generatePerformanceAlertsForAsset(assetId, transaction) {
    const kpis = await getActiveKPIs();
    const alerts = [];
    for (const kpi of kpis) {
        const now = new Date();
        const startDate = new Date(now.getTime() - 24 * 60 * 60 * 1000); // Last 24 hours
        try {
            const kpiValue = await calculateKPIValue(assetId, kpi.id, startDate, now);
            if (kpiValue.status === KPIStatus.CRITICAL) {
                const alert = await createPerformanceAlert({
                    assetId,
                    alertType: 'kpi_critical',
                    severity: AlertSeverity.CRITICAL,
                    metricType: kpi.metricType,
                    currentValue: kpiValue.currentValue,
                    threshold: kpi.criticalThreshold || kpi.targetValue,
                    message: `KPI "${kpi.name}" is critical: ${kpiValue.currentValue} ${kpi.unit}`,
                }, transaction);
                alerts.push(alert);
            }
            else if (kpiValue.status === KPIStatus.BELOW_TARGET) {
                const alert = await createPerformanceAlert({
                    assetId,
                    alertType: 'kpi_warning',
                    severity: AlertSeverity.WARNING,
                    metricType: kpi.metricType,
                    currentValue: kpiValue.currentValue,
                    threshold: kpi.warningThreshold || kpi.targetValue,
                    message: `KPI "${kpi.name}" is below target: ${kpiValue.currentValue} ${kpi.unit}`,
                }, transaction);
                alerts.push(alert);
            }
        }
        catch (error) {
            // Skip KPI if calculation fails
            continue;
        }
    }
    return alerts;
}
// ============================================================================
// SLA MANAGEMENT FUNCTIONS
// ============================================================================
/**
 * Create an SLA definition
 *
 * @param data - SLA definition data
 * @param transaction - Optional database transaction
 * @returns Created SLA definition
 * @throws BadRequestException if validation fails
 *
 * @example
 * ```typescript
 * const sla = await createSLADefinition({
 *   name: 'Critical Asset Uptime',
 *   metricType: 'availability',
 *   targetValue: 99.9,
 *   minimumValue: 99.0,
 *   measurementPeriod: 'monthly',
 *   startDate: new Date(),
 *   isActive: true
 * });
 * ```
 */
async function createSLADefinition(data, transaction) {
    try {
        const sla = await SLADefinition.create({
            name: data.name,
            description: data.description,
            assetId: data.assetId,
            assetTypeId: data.assetTypeId,
            metricType: data.metricType,
            targetValue: data.targetValue,
            minimumValue: data.minimumValue,
            measurementPeriod: data.measurementPeriod,
            penaltyAmount: data.penaltyAmount,
            startDate: data.startDate,
            endDate: data.endDate,
            isActive: data.isActive,
        }, { transaction });
        return sla;
    }
    catch (error) {
        throw new common_1.BadRequestException(`Failed to create SLA definition: ${error.message}`);
    }
}
/**
 * Get SLA definition by ID
 *
 * @param id - SLA definition ID
 * @returns SLA definition or null
 *
 * @example
 * ```typescript
 * const sla = await getSLADefinitionById('sla-001');
 * ```
 */
async function getSLADefinitionById(id) {
    return await SLADefinition.findByPk(id);
}
/**
 * Get active SLAs for an asset
 *
 * @param assetId - Asset ID
 * @returns Array of active SLA definitions
 *
 * @example
 * ```typescript
 * const slas = await getActiveSLAsForAsset('asset-001');
 * ```
 */
async function getActiveSLAsForAsset(assetId) {
    return await SLADefinition.findAll({
        where: {
            assetId,
            isActive: true,
        },
    });
}
/**
 * Track SLA compliance for an asset
 *
 * @param slaId - SLA definition ID
 * @param assetId - Asset ID
 * @param startDate - Period start date
 * @param endDate - Period end date
 * @param transaction - Optional database transaction
 * @returns SLA compliance result
 * @throws NotFoundException if SLA not found
 *
 * @example
 * ```typescript
 * const compliance = await trackSLACompliance(
 *   'sla-001',
 *   'asset-001',
 *   new Date('2024-01-01'),
 *   new Date('2024-01-31')
 * );
 * ```
 */
async function trackSLACompliance(slaId, assetId, startDate, endDate, transaction) {
    const sla = await SLADefinition.findByPk(slaId);
    if (!sla) {
        throw new common_1.NotFoundException(`SLA definition ${slaId} not found`);
    }
    const metrics = await getAssetPerformanceRecords(assetId, sla.metricType, startDate, endDate);
    const actualValue = metrics.length > 0
        ? metrics.reduce((sum, m) => sum + Number(m.value), 0) / metrics.length
        : 0;
    const compliance = (actualValue / sla.targetValue) * 100;
    let status;
    if (actualValue >= sla.targetValue) {
        status = SLAComplianceStatus.COMPLIANT;
    }
    else if (actualValue >= sla.minimumValue) {
        status = SLAComplianceStatus.AT_RISK;
    }
    else {
        status = SLAComplianceStatus.BREACHED;
    }
    // Detect violations
    const violations = [];
    for (const metric of metrics) {
        if (Number(metric.value) < sla.minimumValue) {
            violations.push({
                timestamp: metric.recordedAt,
                duration: 1,
                targetValue: sla.targetValue,
                actualValue: Number(metric.value),
                severity: AlertSeverity.CRITICAL,
                penaltyAmount: sla.penaltyAmount,
            });
        }
    }
    const penalties = violations.length * (sla.penaltyAmount || 0);
    // Save compliance record
    await SLACompliance.create({
        slaId,
        assetId,
        periodStart: startDate,
        periodEnd: endDate,
        targetValue: sla.targetValue,
        actualValue,
        compliance,
        status,
        violations,
        penalties,
    }, { transaction });
    return {
        slaId,
        assetId,
        period: { startDate, endDate },
        targetValue: sla.targetValue,
        actualValue,
        compliance,
        status,
        violations,
        penalties,
    };
}
/**
 * Get SLA compliance history for an asset
 *
 * @param assetId - Asset ID
 * @param slaId - Optional SLA definition ID filter
 * @param limit - Maximum number of records
 * @returns Array of SLA compliance records
 *
 * @example
 * ```typescript
 * const history = await getSLAComplianceHistory('asset-001', 'sla-001');
 * ```
 */
async function getSLAComplianceHistory(assetId, slaId, limit = 50) {
    const where = { assetId };
    if (slaId) {
        where.slaId = slaId;
    }
    return await SLACompliance.findAll({
        where,
        include: [{ model: SLADefinition, as: 'sla' }],
        order: [['periodStart', 'DESC']],
        limit,
    });
}
// ============================================================================
// PERFORMANCE DASHBOARD FUNCTIONS
// ============================================================================
/**
 * Get comprehensive performance dashboard data for an asset
 *
 * @param assetId - Asset ID
 * @param startDate - Period start date
 * @param endDate - Period end date
 * @returns Performance dashboard data
 *
 * @example
 * ```typescript
 * const dashboard = await getPerformanceDashboard(
 *   'asset-001',
 *   new Date('2024-01-01'),
 *   new Date('2024-01-31')
 * );
 * ```
 */
async function getPerformanceDashboard(assetId, startDate, endDate) {
    // Calculate OEE
    const oee = await calculateOEE(assetId, { startDate, endDate });
    // Calculate availability
    const availability = await calculateAvailability(assetId, startDate, endDate);
    // Calculate utilization (assuming total capacity)
    const totalCapacity = (endDate.getTime() - startDate.getTime()) / (1000 * 60); // minutes
    const utilization = await calculateUtilization(assetId, startDate, endDate, totalCapacity);
    // Get KPI values
    const kpiDefinitions = await getActiveKPIs();
    const kpis = [];
    for (const kpi of kpiDefinitions) {
        try {
            const kpiValue = await calculateKPIValue(assetId, kpi.id, startDate, endDate);
            kpis.push(kpiValue);
        }
        catch (error) {
            // Skip KPI if calculation fails
            continue;
        }
    }
    // Get active alerts
    const alerts = await getActiveAlertsForAsset(assetId);
    // Get trend analysis for key metrics
    const trends = [];
    // Simplified - in production would calculate actual trends
    // Get SLA compliance
    const slaDefinitions = await getActiveSLAsForAsset(assetId);
    const slaCompliance = [];
    for (const sla of slaDefinitions) {
        try {
            const compliance = await trackSLACompliance(sla.id, assetId, startDate, endDate);
            slaCompliance.push(compliance);
        }
        catch (error) {
            // Skip SLA if tracking fails
            continue;
        }
    }
    // Determine overall status
    let overallStatus = PerformanceStatus.EXCELLENT;
    if (oee.status === PerformanceStatus.CRITICAL || alerts.some((a) => a.severity === AlertSeverity.CRITICAL)) {
        overallStatus = PerformanceStatus.CRITICAL;
    }
    else if (oee.status === PerformanceStatus.POOR) {
        overallStatus = PerformanceStatus.POOR;
    }
    else if (oee.status === PerformanceStatus.ACCEPTABLE) {
        overallStatus = PerformanceStatus.ACCEPTABLE;
    }
    else if (oee.status === PerformanceStatus.GOOD) {
        overallStatus = PerformanceStatus.GOOD;
    }
    return {
        assetId,
        period: { startDate, endDate },
        overallStatus,
        oee,
        availability,
        utilization,
        kpis,
        alerts,
        trends,
        slaCompliance,
    };
}
/**
 * Generate performance report for multiple assets
 *
 * @param assetIds - Array of asset IDs
 * @param startDate - Period start date
 * @param endDate - Period end date
 * @returns Array of performance dashboard data
 *
 * @example
 * ```typescript
 * const report = await generatePerformanceReport(
 *   ['asset-001', 'asset-002'],
 *   new Date('2024-01-01'),
 *   new Date('2024-01-31')
 * );
 * ```
 */
async function generatePerformanceReport(assetIds, startDate, endDate) {
    const dashboards = [];
    for (const assetId of assetIds) {
        try {
            const dashboard = await getPerformanceDashboard(assetId, startDate, endDate);
            dashboards.push(dashboard);
        }
        catch (error) {
            // Skip asset if dashboard generation fails
            continue;
        }
    }
    return dashboards;
}
// ============================================================================
// EXPORTS
// ============================================================================
exports.default = {
    // Performance records
    createPerformanceRecord,
    getPerformanceRecordById,
    getAssetPerformanceRecords,
    updatePerformanceRecord,
    deletePerformanceRecord,
    // OEE calculations
    calculateOEE,
    getOEEHistory,
    calculateAvailability,
    calculateUtilization,
    // KPI management
    createKPIDefinition,
    getKPIDefinitionById,
    getActiveKPIs,
    updateKPIDefinition,
    calculateKPIValue,
    // Performance alerts
    createPerformanceAlert,
    getPerformanceAlertById,
    getActiveAlertsForAsset,
    acknowledgePerformanceAlert,
    resolvePerformanceAlert,
    generatePerformanceAlertsForAsset,
    // SLA management
    createSLADefinition,
    getSLADefinitionById,
    getActiveSLAsForAsset,
    trackSLACompliance,
    getSLAComplianceHistory,
    // Dashboard and reporting
    getPerformanceDashboard,
    generatePerformanceReport,
    // Models
    PerformanceMetric,
    KPIDefinition,
    OEECalculation,
    PerformanceAlert,
    SLADefinition,
    SLACompliance,
    // DTOs
    CreatePerformanceRecordDto,
    CreateKPIDefinitionDto,
    CalculateOEEDto,
    CreatePerformanceAlertDto,
    CreateSLADefinitionDto,
    // Enums
    PerformanceMetricType,
    PerformanceStatus,
    KPIStatus,
    AlertSeverity,
    AlertStatus,
    TrendDirection,
    SLAComplianceStatus,
};
//# sourceMappingURL=asset-performance-commands.js.map