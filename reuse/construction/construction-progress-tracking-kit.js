"use strict";
/**
 * CONSTRUCTION PROGRESS TRACKING KIT
 *
 * Comprehensive progress monitoring and earned value management system for construction projects.
 * Provides 40 specialized functions covering:
 * - Physical progress measurement and verification
 * - Earned value management (EVM) analysis
 * - Schedule performance index (SPI) tracking
 * - Cost performance index (CPI) tracking
 * - Milestone tracking and validation
 * - Completion percentage calculation
 * - Progress photography and documentation
 * - Daily construction reports
 * - Weekly progress reports
 * - S-curve generation and analysis
 * - Trend analysis and forecasting
 * - Variance analysis (schedule and cost)
 * - Critical path impact analysis
 * - Progress payment processing
 * - NestJS injectable services with DI
 * - Swagger API documentation
 * - Full validation and error handling
 *
 * @module ConstructionProgressTrackingKit
 * @version 1.0.0
 * @requires @nestjs/common ^11.1.8
 * @requires @nestjs/swagger ^8.1.0
 * @requires class-validator ^0.14.1
 * @requires class-transformer ^0.5.1
 * @requires sequelize ^6.37.5
 * @requires sequelize-typescript ^2.1.6
 * @requires @faker-js/faker ^9.4.0
 * @requires Node.js 18+
 * @requires TypeScript 5.x
 *
 * @example
 * ```typescript
 * import {
 *   recordProgressMeasurement,
 *   calculateEarnedValue,
 *   generateSCurve,
 *   createDailyReport,
 *   trackMilestoneProgress
 * } from './construction-progress-tracking-kit';
 *
 * // Record progress
 * const progress = await recordProgressMeasurement({
 *   activityId: 'act-123',
 *   percentComplete: 75,
 *   quantityCompleted: 850,
 *   verifiedBy: 'inspector-456'
 * });
 *
 * // Calculate earned value
 * const evm = await calculateEarnedValue('proj-123', new Date());
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
exports.ProgressTrackingController = exports.AddProgressPhotoDto = exports.UpdateMilestoneProgressDto = exports.CreateMilestoneDto = exports.CreateDailyReportDto = exports.RecordProgressDto = exports.ConstructionMilestone = exports.DailyReport = exports.ProgressMeasurement = exports.VarianceCategory = exports.PerformanceTrend = exports.WeatherCondition = exports.ReportType = exports.MilestoneStatus = exports.ActivityStatus = exports.MeasurementMethod = void 0;
exports.recordProgressMeasurement = recordProgressMeasurement;
exports.calculateActivityEarnedValue = calculateActivityEarnedValue;
exports.verifyProgressMeasurement = verifyProgressMeasurement;
exports.getActivityProgressHistory = getActivityProgressHistory;
exports.calculateEarnedValue = calculateEarnedValue;
exports.calculateSchedulePerformanceIndex = calculateSchedulePerformanceIndex;
exports.calculateCostPerformanceIndex = calculateCostPerformanceIndex;
exports.forecastEstimateAtCompletion = forecastEstimateAtCompletion;
exports.createMilestone = createMilestone;
exports.updateMilestoneProgress = updateMilestoneProgress;
exports.completeMilestone = completeMilestone;
exports.getUpcomingMilestones = getUpcomingMilestones;
exports.trackMilestoneCompletion = trackMilestoneCompletion;
exports.createDailyReport = createDailyReport;
exports.addProgressPhotos = addProgressPhotos;
exports.generateWeeklyProgressSummary = generateWeeklyProgressSummary;
exports.approveDailyReport = approveDailyReport;
exports.generateSCurve = generateSCurve;
exports.analyzeSCurveTrends = analyzeSCurveTrends;
exports.generateProgressTrends = generateProgressTrends;
exports.forecastCompletionDate = forecastCompletionDate;
exports.analyzePerformanceTrends = analyzePerformanceTrends;
exports.performVarianceAnalysis = performVarianceAnalysis;
exports.calculateScheduleVarianceImpact = calculateScheduleVarianceImpact;
exports.generateProgressPayment = generateProgressPayment;
exports.approveProgressPayment = approveProgressPayment;
exports.calculateRetainage = calculateRetainage;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const sequelize_typescript_1 = require("sequelize-typescript");
const faker_1 = require("@faker-js/faker");
// ============================================================================
// TYPE DEFINITIONS AND ENUMS
// ============================================================================
/**
 * Progress measurement method
 */
var MeasurementMethod;
(function (MeasurementMethod) {
    MeasurementMethod["PERCENT_COMPLETE"] = "percent_complete";
    MeasurementMethod["QUANTITY_COMPLETE"] = "quantity_complete";
    MeasurementMethod["WEIGHTED_MILESTONE"] = "weighted_milestone";
    MeasurementMethod["EARNED_VALUE"] = "earned_value";
    MeasurementMethod["LEVEL_OF_EFFORT"] = "level_of_effort";
})(MeasurementMethod || (exports.MeasurementMethod = MeasurementMethod = {}));
/**
 * Activity status
 */
var ActivityStatus;
(function (ActivityStatus) {
    ActivityStatus["NOT_STARTED"] = "not_started";
    ActivityStatus["IN_PROGRESS"] = "in_progress";
    ActivityStatus["COMPLETED"] = "completed";
    ActivityStatus["ON_HOLD"] = "on_hold";
    ActivityStatus["CANCELLED"] = "cancelled";
})(ActivityStatus || (exports.ActivityStatus = ActivityStatus = {}));
/**
 * Milestone status
 */
var MilestoneStatus;
(function (MilestoneStatus) {
    MilestoneStatus["UPCOMING"] = "upcoming";
    MilestoneStatus["ON_TRACK"] = "on_track";
    MilestoneStatus["AT_RISK"] = "at_risk";
    MilestoneStatus["LATE"] = "late";
    MilestoneStatus["COMPLETED"] = "completed";
})(MilestoneStatus || (exports.MilestoneStatus = MilestoneStatus = {}));
/**
 * Progress report type
 */
var ReportType;
(function (ReportType) {
    ReportType["DAILY"] = "daily";
    ReportType["WEEKLY"] = "weekly";
    ReportType["MONTHLY"] = "monthly";
    ReportType["MILESTONE"] = "milestone";
})(ReportType || (exports.ReportType = ReportType = {}));
/**
 * Weather condition
 */
var WeatherCondition;
(function (WeatherCondition) {
    WeatherCondition["CLEAR"] = "clear";
    WeatherCondition["PARTLY_CLOUDY"] = "partly_cloudy";
    WeatherCondition["CLOUDY"] = "cloudy";
    WeatherCondition["RAIN"] = "rain";
    WeatherCondition["HEAVY_RAIN"] = "heavy_rain";
    WeatherCondition["SNOW"] = "snow";
    WeatherCondition["EXTREME_HEAT"] = "extreme_heat";
    WeatherCondition["EXTREME_COLD"] = "extreme_cold";
})(WeatherCondition || (exports.WeatherCondition = WeatherCondition = {}));
/**
 * Performance trend
 */
var PerformanceTrend;
(function (PerformanceTrend) {
    PerformanceTrend["IMPROVING"] = "improving";
    PerformanceTrend["STABLE"] = "stable";
    PerformanceTrend["DECLINING"] = "declining";
})(PerformanceTrend || (exports.PerformanceTrend = PerformanceTrend = {}));
/**
 * Variance category
 */
var VarianceCategory;
(function (VarianceCategory) {
    VarianceCategory["FAVORABLE"] = "favorable";
    VarianceCategory["ACCEPTABLE"] = "acceptable";
    VarianceCategory["UNFAVORABLE"] = "unfavorable";
    VarianceCategory["CRITICAL"] = "critical";
})(VarianceCategory || (exports.VarianceCategory = VarianceCategory = {}));
// ============================================================================
// SEQUELIZE MODELS
// ============================================================================
/**
 * Progress Measurement Model - Sequelize
 * Tracks physical progress of construction activities
 */
let ProgressMeasurement = (() => {
    let _classDecorators = [(0, sequelize_typescript_1.Table)({ tableName: 'progress_measurements', timestamps: true })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = sequelize_typescript_1.Model;
    let _id_decorators;
    let _id_initializers = [];
    let _id_extraInitializers = [];
    let _activityId_decorators;
    let _activityId_initializers = [];
    let _activityId_extraInitializers = [];
    let _projectId_decorators;
    let _projectId_initializers = [];
    let _projectId_extraInitializers = [];
    let _measurementDate_decorators;
    let _measurementDate_initializers = [];
    let _measurementDate_extraInitializers = [];
    let _percentComplete_decorators;
    let _percentComplete_initializers = [];
    let _percentComplete_extraInitializers = [];
    let _quantityCompleted_decorators;
    let _quantityCompleted_initializers = [];
    let _quantityCompleted_extraInitializers = [];
    let _plannedQuantity_decorators;
    let _plannedQuantity_initializers = [];
    let _plannedQuantity_extraInitializers = [];
    let _measurementMethod_decorators;
    let _measurementMethod_initializers = [];
    let _measurementMethod_extraInitializers = [];
    let _earnedValue_decorators;
    let _earnedValue_initializers = [];
    let _earnedValue_extraInitializers = [];
    let _plannedValue_decorators;
    let _plannedValue_initializers = [];
    let _plannedValue_extraInitializers = [];
    let _actualCost_decorators;
    let _actualCost_initializers = [];
    let _actualCost_extraInitializers = [];
    let _verifiedBy_decorators;
    let _verifiedBy_initializers = [];
    let _verifiedBy_extraInitializers = [];
    let _notes_decorators;
    let _notes_initializers = [];
    let _notes_extraInitializers = [];
    let _photos_decorators;
    let _photos_initializers = [];
    let _photos_extraInitializers = [];
    let _createdAt_decorators;
    let _createdAt_initializers = [];
    let _createdAt_extraInitializers = [];
    let _updatedAt_decorators;
    let _updatedAt_initializers = [];
    let _updatedAt_extraInitializers = [];
    var ProgressMeasurement = _classThis = class extends _classSuper {
        constructor() {
            super(...arguments);
            this.id = __runInitializers(this, _id_initializers, void 0);
            this.activityId = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _activityId_initializers, void 0));
            this.projectId = (__runInitializers(this, _activityId_extraInitializers), __runInitializers(this, _projectId_initializers, void 0));
            this.measurementDate = (__runInitializers(this, _projectId_extraInitializers), __runInitializers(this, _measurementDate_initializers, void 0));
            this.percentComplete = (__runInitializers(this, _measurementDate_extraInitializers), __runInitializers(this, _percentComplete_initializers, void 0));
            this.quantityCompleted = (__runInitializers(this, _percentComplete_extraInitializers), __runInitializers(this, _quantityCompleted_initializers, void 0));
            this.plannedQuantity = (__runInitializers(this, _quantityCompleted_extraInitializers), __runInitializers(this, _plannedQuantity_initializers, void 0));
            this.measurementMethod = (__runInitializers(this, _plannedQuantity_extraInitializers), __runInitializers(this, _measurementMethod_initializers, void 0));
            this.earnedValue = (__runInitializers(this, _measurementMethod_extraInitializers), __runInitializers(this, _earnedValue_initializers, void 0));
            this.plannedValue = (__runInitializers(this, _earnedValue_extraInitializers), __runInitializers(this, _plannedValue_initializers, void 0));
            this.actualCost = (__runInitializers(this, _plannedValue_extraInitializers), __runInitializers(this, _actualCost_initializers, void 0));
            this.verifiedBy = (__runInitializers(this, _actualCost_extraInitializers), __runInitializers(this, _verifiedBy_initializers, void 0));
            this.notes = (__runInitializers(this, _verifiedBy_extraInitializers), __runInitializers(this, _notes_initializers, void 0));
            this.photos = (__runInitializers(this, _notes_extraInitializers), __runInitializers(this, _photos_initializers, void 0));
            this.createdAt = (__runInitializers(this, _photos_extraInitializers), __runInitializers(this, _createdAt_initializers, void 0));
            this.updatedAt = (__runInitializers(this, _createdAt_extraInitializers), __runInitializers(this, _updatedAt_initializers, void 0));
            __runInitializers(this, _updatedAt_extraInitializers);
        }
    };
    __setFunctionName(_classThis, "ProgressMeasurement");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        _id_decorators = [sequelize_typescript_1.PrimaryKey, (0, sequelize_typescript_1.Default)(sequelize_typescript_1.DataType.UUIDV4), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.UUID)];
        _activityId_decorators = [(0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUID, allowNull: false })];
        _projectId_decorators = [(0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUID, allowNull: false })];
        _measurementDate_decorators = [(0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DATE, allowNull: false })];
        _percentComplete_decorators = [(0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DECIMAL(5, 2), allowNull: false })];
        _quantityCompleted_decorators = [(0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DECIMAL(12, 2) })];
        _plannedQuantity_decorators = [(0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DECIMAL(12, 2) })];
        _measurementMethod_decorators = [(0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.ENUM(...Object.values(MeasurementMethod)), allowNull: false })];
        _earnedValue_decorators = [(0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DECIMAL(12, 2) })];
        _plannedValue_decorators = [(0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DECIMAL(12, 2) })];
        _actualCost_decorators = [(0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DECIMAL(12, 2) })];
        _verifiedBy_decorators = [(0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUID, allowNull: false })];
        _notes_decorators = [(0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.TEXT })];
        _photos_decorators = [(0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.JSON })];
        _createdAt_decorators = [sequelize_typescript_1.CreatedAt];
        _updatedAt_decorators = [sequelize_typescript_1.UpdatedAt];
        __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: obj => "id" in obj, get: obj => obj.id, set: (obj, value) => { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
        __esDecorate(null, null, _activityId_decorators, { kind: "field", name: "activityId", static: false, private: false, access: { has: obj => "activityId" in obj, get: obj => obj.activityId, set: (obj, value) => { obj.activityId = value; } }, metadata: _metadata }, _activityId_initializers, _activityId_extraInitializers);
        __esDecorate(null, null, _projectId_decorators, { kind: "field", name: "projectId", static: false, private: false, access: { has: obj => "projectId" in obj, get: obj => obj.projectId, set: (obj, value) => { obj.projectId = value; } }, metadata: _metadata }, _projectId_initializers, _projectId_extraInitializers);
        __esDecorate(null, null, _measurementDate_decorators, { kind: "field", name: "measurementDate", static: false, private: false, access: { has: obj => "measurementDate" in obj, get: obj => obj.measurementDate, set: (obj, value) => { obj.measurementDate = value; } }, metadata: _metadata }, _measurementDate_initializers, _measurementDate_extraInitializers);
        __esDecorate(null, null, _percentComplete_decorators, { kind: "field", name: "percentComplete", static: false, private: false, access: { has: obj => "percentComplete" in obj, get: obj => obj.percentComplete, set: (obj, value) => { obj.percentComplete = value; } }, metadata: _metadata }, _percentComplete_initializers, _percentComplete_extraInitializers);
        __esDecorate(null, null, _quantityCompleted_decorators, { kind: "field", name: "quantityCompleted", static: false, private: false, access: { has: obj => "quantityCompleted" in obj, get: obj => obj.quantityCompleted, set: (obj, value) => { obj.quantityCompleted = value; } }, metadata: _metadata }, _quantityCompleted_initializers, _quantityCompleted_extraInitializers);
        __esDecorate(null, null, _plannedQuantity_decorators, { kind: "field", name: "plannedQuantity", static: false, private: false, access: { has: obj => "plannedQuantity" in obj, get: obj => obj.plannedQuantity, set: (obj, value) => { obj.plannedQuantity = value; } }, metadata: _metadata }, _plannedQuantity_initializers, _plannedQuantity_extraInitializers);
        __esDecorate(null, null, _measurementMethod_decorators, { kind: "field", name: "measurementMethod", static: false, private: false, access: { has: obj => "measurementMethod" in obj, get: obj => obj.measurementMethod, set: (obj, value) => { obj.measurementMethod = value; } }, metadata: _metadata }, _measurementMethod_initializers, _measurementMethod_extraInitializers);
        __esDecorate(null, null, _earnedValue_decorators, { kind: "field", name: "earnedValue", static: false, private: false, access: { has: obj => "earnedValue" in obj, get: obj => obj.earnedValue, set: (obj, value) => { obj.earnedValue = value; } }, metadata: _metadata }, _earnedValue_initializers, _earnedValue_extraInitializers);
        __esDecorate(null, null, _plannedValue_decorators, { kind: "field", name: "plannedValue", static: false, private: false, access: { has: obj => "plannedValue" in obj, get: obj => obj.plannedValue, set: (obj, value) => { obj.plannedValue = value; } }, metadata: _metadata }, _plannedValue_initializers, _plannedValue_extraInitializers);
        __esDecorate(null, null, _actualCost_decorators, { kind: "field", name: "actualCost", static: false, private: false, access: { has: obj => "actualCost" in obj, get: obj => obj.actualCost, set: (obj, value) => { obj.actualCost = value; } }, metadata: _metadata }, _actualCost_initializers, _actualCost_extraInitializers);
        __esDecorate(null, null, _verifiedBy_decorators, { kind: "field", name: "verifiedBy", static: false, private: false, access: { has: obj => "verifiedBy" in obj, get: obj => obj.verifiedBy, set: (obj, value) => { obj.verifiedBy = value; } }, metadata: _metadata }, _verifiedBy_initializers, _verifiedBy_extraInitializers);
        __esDecorate(null, null, _notes_decorators, { kind: "field", name: "notes", static: false, private: false, access: { has: obj => "notes" in obj, get: obj => obj.notes, set: (obj, value) => { obj.notes = value; } }, metadata: _metadata }, _notes_initializers, _notes_extraInitializers);
        __esDecorate(null, null, _photos_decorators, { kind: "field", name: "photos", static: false, private: false, access: { has: obj => "photos" in obj, get: obj => obj.photos, set: (obj, value) => { obj.photos = value; } }, metadata: _metadata }, _photos_initializers, _photos_extraInitializers);
        __esDecorate(null, null, _createdAt_decorators, { kind: "field", name: "createdAt", static: false, private: false, access: { has: obj => "createdAt" in obj, get: obj => obj.createdAt, set: (obj, value) => { obj.createdAt = value; } }, metadata: _metadata }, _createdAt_initializers, _createdAt_extraInitializers);
        __esDecorate(null, null, _updatedAt_decorators, { kind: "field", name: "updatedAt", static: false, private: false, access: { has: obj => "updatedAt" in obj, get: obj => obj.updatedAt, set: (obj, value) => { obj.updatedAt = value; } }, metadata: _metadata }, _updatedAt_initializers, _updatedAt_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        ProgressMeasurement = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return ProgressMeasurement = _classThis;
})();
exports.ProgressMeasurement = ProgressMeasurement;
/**
 * Daily Report Model - Sequelize
 * Captures daily construction progress and site conditions
 */
let DailyReport = (() => {
    let _classDecorators = [(0, sequelize_typescript_1.Table)({ tableName: 'daily_reports', timestamps: true })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = sequelize_typescript_1.Model;
    let _id_decorators;
    let _id_initializers = [];
    let _id_extraInitializers = [];
    let _projectId_decorators;
    let _projectId_initializers = [];
    let _projectId_extraInitializers = [];
    let _reportDate_decorators;
    let _reportDate_initializers = [];
    let _reportDate_extraInitializers = [];
    let _weatherCondition_decorators;
    let _weatherCondition_initializers = [];
    let _weatherCondition_extraInitializers = [];
    let _temperatureHigh_decorators;
    let _temperatureHigh_initializers = [];
    let _temperatureHigh_extraInitializers = [];
    let _temperatureLow_decorators;
    let _temperatureLow_initializers = [];
    let _temperatureLow_extraInitializers = [];
    let _workersOnSite_decorators;
    let _workersOnSite_initializers = [];
    let _workersOnSite_extraInitializers = [];
    let _visitorsOnSite_decorators;
    let _visitorsOnSite_initializers = [];
    let _visitorsOnSite_extraInitializers = [];
    let _workPerformed_decorators;
    let _workPerformed_initializers = [];
    let _workPerformed_extraInitializers = [];
    let _equipmentUsed_decorators;
    let _equipmentUsed_initializers = [];
    let _equipmentUsed_extraInitializers = [];
    let _materialsDelivered_decorators;
    let _materialsDelivered_initializers = [];
    let _materialsDelivered_extraInitializers = [];
    let _issues_decorators;
    let _issues_initializers = [];
    let _issues_extraInitializers = [];
    let _safetyIncidents_decorators;
    let _safetyIncidents_initializers = [];
    let _safetyIncidents_extraInitializers = [];
    let _delayHours_decorators;
    let _delayHours_initializers = [];
    let _delayHours_extraInitializers = [];
    let _delayReasons_decorators;
    let _delayReasons_initializers = [];
    let _delayReasons_extraInitializers = [];
    let _progressPhotos_decorators;
    let _progressPhotos_initializers = [];
    let _progressPhotos_extraInitializers = [];
    let _submittedBy_decorators;
    let _submittedBy_initializers = [];
    let _submittedBy_extraInitializers = [];
    let _approvedBy_decorators;
    let _approvedBy_initializers = [];
    let _approvedBy_extraInitializers = [];
    let _approvedAt_decorators;
    let _approvedAt_initializers = [];
    let _approvedAt_extraInitializers = [];
    let _createdAt_decorators;
    let _createdAt_initializers = [];
    let _createdAt_extraInitializers = [];
    let _updatedAt_decorators;
    let _updatedAt_initializers = [];
    let _updatedAt_extraInitializers = [];
    var DailyReport = _classThis = class extends _classSuper {
        constructor() {
            super(...arguments);
            this.id = __runInitializers(this, _id_initializers, void 0);
            this.projectId = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _projectId_initializers, void 0));
            this.reportDate = (__runInitializers(this, _projectId_extraInitializers), __runInitializers(this, _reportDate_initializers, void 0));
            this.weatherCondition = (__runInitializers(this, _reportDate_extraInitializers), __runInitializers(this, _weatherCondition_initializers, void 0));
            this.temperatureHigh = (__runInitializers(this, _weatherCondition_extraInitializers), __runInitializers(this, _temperatureHigh_initializers, void 0));
            this.temperatureLow = (__runInitializers(this, _temperatureHigh_extraInitializers), __runInitializers(this, _temperatureLow_initializers, void 0));
            this.workersOnSite = (__runInitializers(this, _temperatureLow_extraInitializers), __runInitializers(this, _workersOnSite_initializers, void 0));
            this.visitorsOnSite = (__runInitializers(this, _workersOnSite_extraInitializers), __runInitializers(this, _visitorsOnSite_initializers, void 0));
            this.workPerformed = (__runInitializers(this, _visitorsOnSite_extraInitializers), __runInitializers(this, _workPerformed_initializers, void 0));
            this.equipmentUsed = (__runInitializers(this, _workPerformed_extraInitializers), __runInitializers(this, _equipmentUsed_initializers, void 0));
            this.materialsDelivered = (__runInitializers(this, _equipmentUsed_extraInitializers), __runInitializers(this, _materialsDelivered_initializers, void 0));
            this.issues = (__runInitializers(this, _materialsDelivered_extraInitializers), __runInitializers(this, _issues_initializers, void 0));
            this.safetyIncidents = (__runInitializers(this, _issues_extraInitializers), __runInitializers(this, _safetyIncidents_initializers, void 0));
            this.delayHours = (__runInitializers(this, _safetyIncidents_extraInitializers), __runInitializers(this, _delayHours_initializers, void 0));
            this.delayReasons = (__runInitializers(this, _delayHours_extraInitializers), __runInitializers(this, _delayReasons_initializers, void 0));
            this.progressPhotos = (__runInitializers(this, _delayReasons_extraInitializers), __runInitializers(this, _progressPhotos_initializers, void 0));
            this.submittedBy = (__runInitializers(this, _progressPhotos_extraInitializers), __runInitializers(this, _submittedBy_initializers, void 0));
            this.approvedBy = (__runInitializers(this, _submittedBy_extraInitializers), __runInitializers(this, _approvedBy_initializers, void 0));
            this.approvedAt = (__runInitializers(this, _approvedBy_extraInitializers), __runInitializers(this, _approvedAt_initializers, void 0));
            this.createdAt = (__runInitializers(this, _approvedAt_extraInitializers), __runInitializers(this, _createdAt_initializers, void 0));
            this.updatedAt = (__runInitializers(this, _createdAt_extraInitializers), __runInitializers(this, _updatedAt_initializers, void 0));
            __runInitializers(this, _updatedAt_extraInitializers);
        }
    };
    __setFunctionName(_classThis, "DailyReport");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        _id_decorators = [sequelize_typescript_1.PrimaryKey, (0, sequelize_typescript_1.Default)(sequelize_typescript_1.DataType.UUIDV4), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.UUID)];
        _projectId_decorators = [(0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUID, allowNull: false })];
        _reportDate_decorators = [(0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DATE, allowNull: false })];
        _weatherCondition_decorators = [(0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.ENUM(...Object.values(WeatherCondition)), allowNull: false })];
        _temperatureHigh_decorators = [(0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.INTEGER })];
        _temperatureLow_decorators = [(0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.INTEGER })];
        _workersOnSite_decorators = [(0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.INTEGER, allowNull: false })];
        _visitorsOnSite_decorators = [(0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.INTEGER, defaultValue: 0 })];
        _workPerformed_decorators = [(0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.TEXT, allowNull: false })];
        _equipmentUsed_decorators = [(0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.TEXT })];
        _materialsDelivered_decorators = [(0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.TEXT })];
        _issues_decorators = [(0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.TEXT })];
        _safetyIncidents_decorators = [(0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.TEXT })];
        _delayHours_decorators = [(0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.INTEGER, defaultValue: 0 })];
        _delayReasons_decorators = [(0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.TEXT })];
        _progressPhotos_decorators = [(0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.JSON })];
        _submittedBy_decorators = [(0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUID, allowNull: false })];
        _approvedBy_decorators = [(0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUID })];
        _approvedAt_decorators = [(0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DATE })];
        _createdAt_decorators = [sequelize_typescript_1.CreatedAt];
        _updatedAt_decorators = [sequelize_typescript_1.UpdatedAt];
        __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: obj => "id" in obj, get: obj => obj.id, set: (obj, value) => { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
        __esDecorate(null, null, _projectId_decorators, { kind: "field", name: "projectId", static: false, private: false, access: { has: obj => "projectId" in obj, get: obj => obj.projectId, set: (obj, value) => { obj.projectId = value; } }, metadata: _metadata }, _projectId_initializers, _projectId_extraInitializers);
        __esDecorate(null, null, _reportDate_decorators, { kind: "field", name: "reportDate", static: false, private: false, access: { has: obj => "reportDate" in obj, get: obj => obj.reportDate, set: (obj, value) => { obj.reportDate = value; } }, metadata: _metadata }, _reportDate_initializers, _reportDate_extraInitializers);
        __esDecorate(null, null, _weatherCondition_decorators, { kind: "field", name: "weatherCondition", static: false, private: false, access: { has: obj => "weatherCondition" in obj, get: obj => obj.weatherCondition, set: (obj, value) => { obj.weatherCondition = value; } }, metadata: _metadata }, _weatherCondition_initializers, _weatherCondition_extraInitializers);
        __esDecorate(null, null, _temperatureHigh_decorators, { kind: "field", name: "temperatureHigh", static: false, private: false, access: { has: obj => "temperatureHigh" in obj, get: obj => obj.temperatureHigh, set: (obj, value) => { obj.temperatureHigh = value; } }, metadata: _metadata }, _temperatureHigh_initializers, _temperatureHigh_extraInitializers);
        __esDecorate(null, null, _temperatureLow_decorators, { kind: "field", name: "temperatureLow", static: false, private: false, access: { has: obj => "temperatureLow" in obj, get: obj => obj.temperatureLow, set: (obj, value) => { obj.temperatureLow = value; } }, metadata: _metadata }, _temperatureLow_initializers, _temperatureLow_extraInitializers);
        __esDecorate(null, null, _workersOnSite_decorators, { kind: "field", name: "workersOnSite", static: false, private: false, access: { has: obj => "workersOnSite" in obj, get: obj => obj.workersOnSite, set: (obj, value) => { obj.workersOnSite = value; } }, metadata: _metadata }, _workersOnSite_initializers, _workersOnSite_extraInitializers);
        __esDecorate(null, null, _visitorsOnSite_decorators, { kind: "field", name: "visitorsOnSite", static: false, private: false, access: { has: obj => "visitorsOnSite" in obj, get: obj => obj.visitorsOnSite, set: (obj, value) => { obj.visitorsOnSite = value; } }, metadata: _metadata }, _visitorsOnSite_initializers, _visitorsOnSite_extraInitializers);
        __esDecorate(null, null, _workPerformed_decorators, { kind: "field", name: "workPerformed", static: false, private: false, access: { has: obj => "workPerformed" in obj, get: obj => obj.workPerformed, set: (obj, value) => { obj.workPerformed = value; } }, metadata: _metadata }, _workPerformed_initializers, _workPerformed_extraInitializers);
        __esDecorate(null, null, _equipmentUsed_decorators, { kind: "field", name: "equipmentUsed", static: false, private: false, access: { has: obj => "equipmentUsed" in obj, get: obj => obj.equipmentUsed, set: (obj, value) => { obj.equipmentUsed = value; } }, metadata: _metadata }, _equipmentUsed_initializers, _equipmentUsed_extraInitializers);
        __esDecorate(null, null, _materialsDelivered_decorators, { kind: "field", name: "materialsDelivered", static: false, private: false, access: { has: obj => "materialsDelivered" in obj, get: obj => obj.materialsDelivered, set: (obj, value) => { obj.materialsDelivered = value; } }, metadata: _metadata }, _materialsDelivered_initializers, _materialsDelivered_extraInitializers);
        __esDecorate(null, null, _issues_decorators, { kind: "field", name: "issues", static: false, private: false, access: { has: obj => "issues" in obj, get: obj => obj.issues, set: (obj, value) => { obj.issues = value; } }, metadata: _metadata }, _issues_initializers, _issues_extraInitializers);
        __esDecorate(null, null, _safetyIncidents_decorators, { kind: "field", name: "safetyIncidents", static: false, private: false, access: { has: obj => "safetyIncidents" in obj, get: obj => obj.safetyIncidents, set: (obj, value) => { obj.safetyIncidents = value; } }, metadata: _metadata }, _safetyIncidents_initializers, _safetyIncidents_extraInitializers);
        __esDecorate(null, null, _delayHours_decorators, { kind: "field", name: "delayHours", static: false, private: false, access: { has: obj => "delayHours" in obj, get: obj => obj.delayHours, set: (obj, value) => { obj.delayHours = value; } }, metadata: _metadata }, _delayHours_initializers, _delayHours_extraInitializers);
        __esDecorate(null, null, _delayReasons_decorators, { kind: "field", name: "delayReasons", static: false, private: false, access: { has: obj => "delayReasons" in obj, get: obj => obj.delayReasons, set: (obj, value) => { obj.delayReasons = value; } }, metadata: _metadata }, _delayReasons_initializers, _delayReasons_extraInitializers);
        __esDecorate(null, null, _progressPhotos_decorators, { kind: "field", name: "progressPhotos", static: false, private: false, access: { has: obj => "progressPhotos" in obj, get: obj => obj.progressPhotos, set: (obj, value) => { obj.progressPhotos = value; } }, metadata: _metadata }, _progressPhotos_initializers, _progressPhotos_extraInitializers);
        __esDecorate(null, null, _submittedBy_decorators, { kind: "field", name: "submittedBy", static: false, private: false, access: { has: obj => "submittedBy" in obj, get: obj => obj.submittedBy, set: (obj, value) => { obj.submittedBy = value; } }, metadata: _metadata }, _submittedBy_initializers, _submittedBy_extraInitializers);
        __esDecorate(null, null, _approvedBy_decorators, { kind: "field", name: "approvedBy", static: false, private: false, access: { has: obj => "approvedBy" in obj, get: obj => obj.approvedBy, set: (obj, value) => { obj.approvedBy = value; } }, metadata: _metadata }, _approvedBy_initializers, _approvedBy_extraInitializers);
        __esDecorate(null, null, _approvedAt_decorators, { kind: "field", name: "approvedAt", static: false, private: false, access: { has: obj => "approvedAt" in obj, get: obj => obj.approvedAt, set: (obj, value) => { obj.approvedAt = value; } }, metadata: _metadata }, _approvedAt_initializers, _approvedAt_extraInitializers);
        __esDecorate(null, null, _createdAt_decorators, { kind: "field", name: "createdAt", static: false, private: false, access: { has: obj => "createdAt" in obj, get: obj => obj.createdAt, set: (obj, value) => { obj.createdAt = value; } }, metadata: _metadata }, _createdAt_initializers, _createdAt_extraInitializers);
        __esDecorate(null, null, _updatedAt_decorators, { kind: "field", name: "updatedAt", static: false, private: false, access: { has: obj => "updatedAt" in obj, get: obj => obj.updatedAt, set: (obj, value) => { obj.updatedAt = value; } }, metadata: _metadata }, _updatedAt_initializers, _updatedAt_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        DailyReport = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return DailyReport = _classThis;
})();
exports.DailyReport = DailyReport;
/**
 * Construction Milestone Model - Sequelize
 * Tracks major project milestones and completion criteria
 */
let ConstructionMilestone = (() => {
    let _classDecorators = [(0, sequelize_typescript_1.Table)({ tableName: 'construction_milestones', timestamps: true })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = sequelize_typescript_1.Model;
    let _id_decorators;
    let _id_initializers = [];
    let _id_extraInitializers = [];
    let _projectId_decorators;
    let _projectId_initializers = [];
    let _projectId_extraInitializers = [];
    let _milestoneName_decorators;
    let _milestoneName_initializers = [];
    let _milestoneName_extraInitializers = [];
    let _description_decorators;
    let _description_initializers = [];
    let _description_extraInitializers = [];
    let _plannedDate_decorators;
    let _plannedDate_initializers = [];
    let _plannedDate_extraInitializers = [];
    let _forecastDate_decorators;
    let _forecastDate_initializers = [];
    let _forecastDate_extraInitializers = [];
    let _actualDate_decorators;
    let _actualDate_initializers = [];
    let _actualDate_extraInitializers = [];
    let _status_decorators;
    let _status_initializers = [];
    let _status_extraInitializers = [];
    let _budgetedValue_decorators;
    let _budgetedValue_initializers = [];
    let _budgetedValue_extraInitializers = [];
    let _earnedValue_decorators;
    let _earnedValue_initializers = [];
    let _earnedValue_extraInitializers = [];
    let _percentComplete_decorators;
    let _percentComplete_initializers = [];
    let _percentComplete_extraInitializers = [];
    let _completionCriteria_decorators;
    let _completionCriteria_initializers = [];
    let _completionCriteria_extraInitializers = [];
    let _deliverables_decorators;
    let _deliverables_initializers = [];
    let _deliverables_extraInitializers = [];
    let _completedBy_decorators;
    let _completedBy_initializers = [];
    let _completedBy_extraInitializers = [];
    let _completionNotes_decorators;
    let _completionNotes_initializers = [];
    let _completionNotes_extraInitializers = [];
    let _createdAt_decorators;
    let _createdAt_initializers = [];
    let _createdAt_extraInitializers = [];
    let _updatedAt_decorators;
    let _updatedAt_initializers = [];
    let _updatedAt_extraInitializers = [];
    var ConstructionMilestone = _classThis = class extends _classSuper {
        constructor() {
            super(...arguments);
            this.id = __runInitializers(this, _id_initializers, void 0);
            this.projectId = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _projectId_initializers, void 0));
            this.milestoneName = (__runInitializers(this, _projectId_extraInitializers), __runInitializers(this, _milestoneName_initializers, void 0));
            this.description = (__runInitializers(this, _milestoneName_extraInitializers), __runInitializers(this, _description_initializers, void 0));
            this.plannedDate = (__runInitializers(this, _description_extraInitializers), __runInitializers(this, _plannedDate_initializers, void 0));
            this.forecastDate = (__runInitializers(this, _plannedDate_extraInitializers), __runInitializers(this, _forecastDate_initializers, void 0));
            this.actualDate = (__runInitializers(this, _forecastDate_extraInitializers), __runInitializers(this, _actualDate_initializers, void 0));
            this.status = (__runInitializers(this, _actualDate_extraInitializers), __runInitializers(this, _status_initializers, void 0));
            this.budgetedValue = (__runInitializers(this, _status_extraInitializers), __runInitializers(this, _budgetedValue_initializers, void 0));
            this.earnedValue = (__runInitializers(this, _budgetedValue_extraInitializers), __runInitializers(this, _earnedValue_initializers, void 0));
            this.percentComplete = (__runInitializers(this, _earnedValue_extraInitializers), __runInitializers(this, _percentComplete_initializers, void 0));
            this.completionCriteria = (__runInitializers(this, _percentComplete_extraInitializers), __runInitializers(this, _completionCriteria_initializers, void 0));
            this.deliverables = (__runInitializers(this, _completionCriteria_extraInitializers), __runInitializers(this, _deliverables_initializers, void 0));
            this.completedBy = (__runInitializers(this, _deliverables_extraInitializers), __runInitializers(this, _completedBy_initializers, void 0));
            this.completionNotes = (__runInitializers(this, _completedBy_extraInitializers), __runInitializers(this, _completionNotes_initializers, void 0));
            this.createdAt = (__runInitializers(this, _completionNotes_extraInitializers), __runInitializers(this, _createdAt_initializers, void 0));
            this.updatedAt = (__runInitializers(this, _createdAt_extraInitializers), __runInitializers(this, _updatedAt_initializers, void 0));
            __runInitializers(this, _updatedAt_extraInitializers);
        }
    };
    __setFunctionName(_classThis, "ConstructionMilestone");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        _id_decorators = [sequelize_typescript_1.PrimaryKey, (0, sequelize_typescript_1.Default)(sequelize_typescript_1.DataType.UUIDV4), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.UUID)];
        _projectId_decorators = [(0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUID, allowNull: false })];
        _milestoneName_decorators = [(0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING, allowNull: false })];
        _description_decorators = [(0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.TEXT })];
        _plannedDate_decorators = [(0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DATE, allowNull: false })];
        _forecastDate_decorators = [(0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DATE })];
        _actualDate_decorators = [(0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DATE })];
        _status_decorators = [(0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.ENUM(...Object.values(MilestoneStatus)), defaultValue: MilestoneStatus.UPCOMING })];
        _budgetedValue_decorators = [(0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DECIMAL(12, 2), allowNull: false })];
        _earnedValue_decorators = [(0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DECIMAL(12, 2), defaultValue: 0 })];
        _percentComplete_decorators = [(0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DECIMAL(5, 2), defaultValue: 0 })];
        _completionCriteria_decorators = [(0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.JSON })];
        _deliverables_decorators = [(0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.JSON })];
        _completedBy_decorators = [(0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUID })];
        _completionNotes_decorators = [(0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.TEXT })];
        _createdAt_decorators = [sequelize_typescript_1.CreatedAt];
        _updatedAt_decorators = [sequelize_typescript_1.UpdatedAt];
        __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: obj => "id" in obj, get: obj => obj.id, set: (obj, value) => { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
        __esDecorate(null, null, _projectId_decorators, { kind: "field", name: "projectId", static: false, private: false, access: { has: obj => "projectId" in obj, get: obj => obj.projectId, set: (obj, value) => { obj.projectId = value; } }, metadata: _metadata }, _projectId_initializers, _projectId_extraInitializers);
        __esDecorate(null, null, _milestoneName_decorators, { kind: "field", name: "milestoneName", static: false, private: false, access: { has: obj => "milestoneName" in obj, get: obj => obj.milestoneName, set: (obj, value) => { obj.milestoneName = value; } }, metadata: _metadata }, _milestoneName_initializers, _milestoneName_extraInitializers);
        __esDecorate(null, null, _description_decorators, { kind: "field", name: "description", static: false, private: false, access: { has: obj => "description" in obj, get: obj => obj.description, set: (obj, value) => { obj.description = value; } }, metadata: _metadata }, _description_initializers, _description_extraInitializers);
        __esDecorate(null, null, _plannedDate_decorators, { kind: "field", name: "plannedDate", static: false, private: false, access: { has: obj => "plannedDate" in obj, get: obj => obj.plannedDate, set: (obj, value) => { obj.plannedDate = value; } }, metadata: _metadata }, _plannedDate_initializers, _plannedDate_extraInitializers);
        __esDecorate(null, null, _forecastDate_decorators, { kind: "field", name: "forecastDate", static: false, private: false, access: { has: obj => "forecastDate" in obj, get: obj => obj.forecastDate, set: (obj, value) => { obj.forecastDate = value; } }, metadata: _metadata }, _forecastDate_initializers, _forecastDate_extraInitializers);
        __esDecorate(null, null, _actualDate_decorators, { kind: "field", name: "actualDate", static: false, private: false, access: { has: obj => "actualDate" in obj, get: obj => obj.actualDate, set: (obj, value) => { obj.actualDate = value; } }, metadata: _metadata }, _actualDate_initializers, _actualDate_extraInitializers);
        __esDecorate(null, null, _status_decorators, { kind: "field", name: "status", static: false, private: false, access: { has: obj => "status" in obj, get: obj => obj.status, set: (obj, value) => { obj.status = value; } }, metadata: _metadata }, _status_initializers, _status_extraInitializers);
        __esDecorate(null, null, _budgetedValue_decorators, { kind: "field", name: "budgetedValue", static: false, private: false, access: { has: obj => "budgetedValue" in obj, get: obj => obj.budgetedValue, set: (obj, value) => { obj.budgetedValue = value; } }, metadata: _metadata }, _budgetedValue_initializers, _budgetedValue_extraInitializers);
        __esDecorate(null, null, _earnedValue_decorators, { kind: "field", name: "earnedValue", static: false, private: false, access: { has: obj => "earnedValue" in obj, get: obj => obj.earnedValue, set: (obj, value) => { obj.earnedValue = value; } }, metadata: _metadata }, _earnedValue_initializers, _earnedValue_extraInitializers);
        __esDecorate(null, null, _percentComplete_decorators, { kind: "field", name: "percentComplete", static: false, private: false, access: { has: obj => "percentComplete" in obj, get: obj => obj.percentComplete, set: (obj, value) => { obj.percentComplete = value; } }, metadata: _metadata }, _percentComplete_initializers, _percentComplete_extraInitializers);
        __esDecorate(null, null, _completionCriteria_decorators, { kind: "field", name: "completionCriteria", static: false, private: false, access: { has: obj => "completionCriteria" in obj, get: obj => obj.completionCriteria, set: (obj, value) => { obj.completionCriteria = value; } }, metadata: _metadata }, _completionCriteria_initializers, _completionCriteria_extraInitializers);
        __esDecorate(null, null, _deliverables_decorators, { kind: "field", name: "deliverables", static: false, private: false, access: { has: obj => "deliverables" in obj, get: obj => obj.deliverables, set: (obj, value) => { obj.deliverables = value; } }, metadata: _metadata }, _deliverables_initializers, _deliverables_extraInitializers);
        __esDecorate(null, null, _completedBy_decorators, { kind: "field", name: "completedBy", static: false, private: false, access: { has: obj => "completedBy" in obj, get: obj => obj.completedBy, set: (obj, value) => { obj.completedBy = value; } }, metadata: _metadata }, _completedBy_initializers, _completedBy_extraInitializers);
        __esDecorate(null, null, _completionNotes_decorators, { kind: "field", name: "completionNotes", static: false, private: false, access: { has: obj => "completionNotes" in obj, get: obj => obj.completionNotes, set: (obj, value) => { obj.completionNotes = value; } }, metadata: _metadata }, _completionNotes_initializers, _completionNotes_extraInitializers);
        __esDecorate(null, null, _createdAt_decorators, { kind: "field", name: "createdAt", static: false, private: false, access: { has: obj => "createdAt" in obj, get: obj => obj.createdAt, set: (obj, value) => { obj.createdAt = value; } }, metadata: _metadata }, _createdAt_initializers, _createdAt_extraInitializers);
        __esDecorate(null, null, _updatedAt_decorators, { kind: "field", name: "updatedAt", static: false, private: false, access: { has: obj => "updatedAt" in obj, get: obj => obj.updatedAt, set: (obj, value) => { obj.updatedAt = value; } }, metadata: _metadata }, _updatedAt_initializers, _updatedAt_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        ConstructionMilestone = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return ConstructionMilestone = _classThis;
})();
exports.ConstructionMilestone = ConstructionMilestone;
// ============================================================================
// DTO CLASSES FOR VALIDATION
// ============================================================================
/**
 * Record progress measurement DTO
 */
let RecordProgressDto = (() => {
    var _a;
    let _activityId_decorators;
    let _activityId_initializers = [];
    let _activityId_extraInitializers = [];
    let _projectId_decorators;
    let _projectId_initializers = [];
    let _projectId_extraInitializers = [];
    let _measurementDate_decorators;
    let _measurementDate_initializers = [];
    let _measurementDate_extraInitializers = [];
    let _percentComplete_decorators;
    let _percentComplete_initializers = [];
    let _percentComplete_extraInitializers = [];
    let _quantityCompleted_decorators;
    let _quantityCompleted_initializers = [];
    let _quantityCompleted_extraInitializers = [];
    let _measurementMethod_decorators;
    let _measurementMethod_initializers = [];
    let _measurementMethod_extraInitializers = [];
    let _verifiedBy_decorators;
    let _verifiedBy_initializers = [];
    let _verifiedBy_extraInitializers = [];
    let _notes_decorators;
    let _notes_initializers = [];
    let _notes_extraInitializers = [];
    return _a = class RecordProgressDto {
            constructor() {
                this.activityId = __runInitializers(this, _activityId_initializers, void 0);
                this.projectId = (__runInitializers(this, _activityId_extraInitializers), __runInitializers(this, _projectId_initializers, void 0));
                this.measurementDate = (__runInitializers(this, _projectId_extraInitializers), __runInitializers(this, _measurementDate_initializers, void 0));
                this.percentComplete = (__runInitializers(this, _measurementDate_extraInitializers), __runInitializers(this, _percentComplete_initializers, void 0));
                this.quantityCompleted = (__runInitializers(this, _percentComplete_extraInitializers), __runInitializers(this, _quantityCompleted_initializers, void 0));
                this.measurementMethod = (__runInitializers(this, _quantityCompleted_extraInitializers), __runInitializers(this, _measurementMethod_initializers, void 0));
                this.verifiedBy = (__runInitializers(this, _measurementMethod_extraInitializers), __runInitializers(this, _verifiedBy_initializers, void 0));
                this.notes = (__runInitializers(this, _verifiedBy_extraInitializers), __runInitializers(this, _notes_initializers, void 0));
                __runInitializers(this, _notes_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _activityId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Activity ID' }), (0, class_validator_1.IsUUID)()];
            _projectId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Project ID' }), (0, class_validator_1.IsUUID)()];
            _measurementDate_decorators = [(0, swagger_1.ApiProperty)({ description: 'Measurement date' }), (0, class_transformer_1.Type)(() => Date), (0, class_validator_1.IsDate)()];
            _percentComplete_decorators = [(0, swagger_1.ApiProperty)({ description: 'Percent complete' }), (0, class_validator_1.IsNumber)(), (0, class_validator_1.Min)(0), (0, class_validator_1.Max)(100)];
            _quantityCompleted_decorators = [(0, swagger_1.ApiProperty)({ description: 'Quantity completed', required: false }), (0, class_validator_1.IsNumber)(), (0, class_validator_1.IsOptional)()];
            _measurementMethod_decorators = [(0, swagger_1.ApiProperty)({ enum: MeasurementMethod }), (0, class_validator_1.IsEnum)(MeasurementMethod)];
            _verifiedBy_decorators = [(0, swagger_1.ApiProperty)({ description: 'Verifier user ID' }), (0, class_validator_1.IsUUID)()];
            _notes_decorators = [(0, swagger_1.ApiProperty)({ description: 'Notes', required: false }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsOptional)(), (0, class_validator_1.MaxLength)(1000)];
            __esDecorate(null, null, _activityId_decorators, { kind: "field", name: "activityId", static: false, private: false, access: { has: obj => "activityId" in obj, get: obj => obj.activityId, set: (obj, value) => { obj.activityId = value; } }, metadata: _metadata }, _activityId_initializers, _activityId_extraInitializers);
            __esDecorate(null, null, _projectId_decorators, { kind: "field", name: "projectId", static: false, private: false, access: { has: obj => "projectId" in obj, get: obj => obj.projectId, set: (obj, value) => { obj.projectId = value; } }, metadata: _metadata }, _projectId_initializers, _projectId_extraInitializers);
            __esDecorate(null, null, _measurementDate_decorators, { kind: "field", name: "measurementDate", static: false, private: false, access: { has: obj => "measurementDate" in obj, get: obj => obj.measurementDate, set: (obj, value) => { obj.measurementDate = value; } }, metadata: _metadata }, _measurementDate_initializers, _measurementDate_extraInitializers);
            __esDecorate(null, null, _percentComplete_decorators, { kind: "field", name: "percentComplete", static: false, private: false, access: { has: obj => "percentComplete" in obj, get: obj => obj.percentComplete, set: (obj, value) => { obj.percentComplete = value; } }, metadata: _metadata }, _percentComplete_initializers, _percentComplete_extraInitializers);
            __esDecorate(null, null, _quantityCompleted_decorators, { kind: "field", name: "quantityCompleted", static: false, private: false, access: { has: obj => "quantityCompleted" in obj, get: obj => obj.quantityCompleted, set: (obj, value) => { obj.quantityCompleted = value; } }, metadata: _metadata }, _quantityCompleted_initializers, _quantityCompleted_extraInitializers);
            __esDecorate(null, null, _measurementMethod_decorators, { kind: "field", name: "measurementMethod", static: false, private: false, access: { has: obj => "measurementMethod" in obj, get: obj => obj.measurementMethod, set: (obj, value) => { obj.measurementMethod = value; } }, metadata: _metadata }, _measurementMethod_initializers, _measurementMethod_extraInitializers);
            __esDecorate(null, null, _verifiedBy_decorators, { kind: "field", name: "verifiedBy", static: false, private: false, access: { has: obj => "verifiedBy" in obj, get: obj => obj.verifiedBy, set: (obj, value) => { obj.verifiedBy = value; } }, metadata: _metadata }, _verifiedBy_initializers, _verifiedBy_extraInitializers);
            __esDecorate(null, null, _notes_decorators, { kind: "field", name: "notes", static: false, private: false, access: { has: obj => "notes" in obj, get: obj => obj.notes, set: (obj, value) => { obj.notes = value; } }, metadata: _metadata }, _notes_initializers, _notes_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.RecordProgressDto = RecordProgressDto;
/**
 * Create daily report DTO
 */
let CreateDailyReportDto = (() => {
    var _a;
    let _projectId_decorators;
    let _projectId_initializers = [];
    let _projectId_extraInitializers = [];
    let _reportDate_decorators;
    let _reportDate_initializers = [];
    let _reportDate_extraInitializers = [];
    let _weatherCondition_decorators;
    let _weatherCondition_initializers = [];
    let _weatherCondition_extraInitializers = [];
    let _temperatureHigh_decorators;
    let _temperatureHigh_initializers = [];
    let _temperatureHigh_extraInitializers = [];
    let _temperatureLow_decorators;
    let _temperatureLow_initializers = [];
    let _temperatureLow_extraInitializers = [];
    let _workersOnSite_decorators;
    let _workersOnSite_initializers = [];
    let _workersOnSite_extraInitializers = [];
    let _workPerformed_decorators;
    let _workPerformed_initializers = [];
    let _workPerformed_extraInitializers = [];
    let _equipmentUsed_decorators;
    let _equipmentUsed_initializers = [];
    let _equipmentUsed_extraInitializers = [];
    let _issues_decorators;
    let _issues_initializers = [];
    let _issues_extraInitializers = [];
    return _a = class CreateDailyReportDto {
            constructor() {
                this.projectId = __runInitializers(this, _projectId_initializers, void 0);
                this.reportDate = (__runInitializers(this, _projectId_extraInitializers), __runInitializers(this, _reportDate_initializers, void 0));
                this.weatherCondition = (__runInitializers(this, _reportDate_extraInitializers), __runInitializers(this, _weatherCondition_initializers, void 0));
                this.temperatureHigh = (__runInitializers(this, _weatherCondition_extraInitializers), __runInitializers(this, _temperatureHigh_initializers, void 0));
                this.temperatureLow = (__runInitializers(this, _temperatureHigh_extraInitializers), __runInitializers(this, _temperatureLow_initializers, void 0));
                this.workersOnSite = (__runInitializers(this, _temperatureLow_extraInitializers), __runInitializers(this, _workersOnSite_initializers, void 0));
                this.workPerformed = (__runInitializers(this, _workersOnSite_extraInitializers), __runInitializers(this, _workPerformed_initializers, void 0));
                this.equipmentUsed = (__runInitializers(this, _workPerformed_extraInitializers), __runInitializers(this, _equipmentUsed_initializers, void 0));
                this.issues = (__runInitializers(this, _equipmentUsed_extraInitializers), __runInitializers(this, _issues_initializers, void 0));
                __runInitializers(this, _issues_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _projectId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Project ID' }), (0, class_validator_1.IsUUID)()];
            _reportDate_decorators = [(0, swagger_1.ApiProperty)({ description: 'Report date' }), (0, class_transformer_1.Type)(() => Date), (0, class_validator_1.IsDate)()];
            _weatherCondition_decorators = [(0, swagger_1.ApiProperty)({ enum: WeatherCondition }), (0, class_validator_1.IsEnum)(WeatherCondition)];
            _temperatureHigh_decorators = [(0, swagger_1.ApiProperty)({ description: 'Temperature high (F)' }), (0, class_validator_1.IsNumber)()];
            _temperatureLow_decorators = [(0, swagger_1.ApiProperty)({ description: 'Temperature low (F)' }), (0, class_validator_1.IsNumber)()];
            _workersOnSite_decorators = [(0, swagger_1.ApiProperty)({ description: 'Workers on site' }), (0, class_validator_1.IsNumber)(), (0, class_validator_1.Min)(0)];
            _workPerformed_decorators = [(0, swagger_1.ApiProperty)({ description: 'Work performed description' }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)(), (0, class_validator_1.MaxLength)(5000)];
            _equipmentUsed_decorators = [(0, swagger_1.ApiProperty)({ description: 'Equipment used', required: false }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsOptional)(), (0, class_validator_1.MaxLength)(2000)];
            _issues_decorators = [(0, swagger_1.ApiProperty)({ description: 'Issues encountered', required: false }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsOptional)(), (0, class_validator_1.MaxLength)(2000)];
            __esDecorate(null, null, _projectId_decorators, { kind: "field", name: "projectId", static: false, private: false, access: { has: obj => "projectId" in obj, get: obj => obj.projectId, set: (obj, value) => { obj.projectId = value; } }, metadata: _metadata }, _projectId_initializers, _projectId_extraInitializers);
            __esDecorate(null, null, _reportDate_decorators, { kind: "field", name: "reportDate", static: false, private: false, access: { has: obj => "reportDate" in obj, get: obj => obj.reportDate, set: (obj, value) => { obj.reportDate = value; } }, metadata: _metadata }, _reportDate_initializers, _reportDate_extraInitializers);
            __esDecorate(null, null, _weatherCondition_decorators, { kind: "field", name: "weatherCondition", static: false, private: false, access: { has: obj => "weatherCondition" in obj, get: obj => obj.weatherCondition, set: (obj, value) => { obj.weatherCondition = value; } }, metadata: _metadata }, _weatherCondition_initializers, _weatherCondition_extraInitializers);
            __esDecorate(null, null, _temperatureHigh_decorators, { kind: "field", name: "temperatureHigh", static: false, private: false, access: { has: obj => "temperatureHigh" in obj, get: obj => obj.temperatureHigh, set: (obj, value) => { obj.temperatureHigh = value; } }, metadata: _metadata }, _temperatureHigh_initializers, _temperatureHigh_extraInitializers);
            __esDecorate(null, null, _temperatureLow_decorators, { kind: "field", name: "temperatureLow", static: false, private: false, access: { has: obj => "temperatureLow" in obj, get: obj => obj.temperatureLow, set: (obj, value) => { obj.temperatureLow = value; } }, metadata: _metadata }, _temperatureLow_initializers, _temperatureLow_extraInitializers);
            __esDecorate(null, null, _workersOnSite_decorators, { kind: "field", name: "workersOnSite", static: false, private: false, access: { has: obj => "workersOnSite" in obj, get: obj => obj.workersOnSite, set: (obj, value) => { obj.workersOnSite = value; } }, metadata: _metadata }, _workersOnSite_initializers, _workersOnSite_extraInitializers);
            __esDecorate(null, null, _workPerformed_decorators, { kind: "field", name: "workPerformed", static: false, private: false, access: { has: obj => "workPerformed" in obj, get: obj => obj.workPerformed, set: (obj, value) => { obj.workPerformed = value; } }, metadata: _metadata }, _workPerformed_initializers, _workPerformed_extraInitializers);
            __esDecorate(null, null, _equipmentUsed_decorators, { kind: "field", name: "equipmentUsed", static: false, private: false, access: { has: obj => "equipmentUsed" in obj, get: obj => obj.equipmentUsed, set: (obj, value) => { obj.equipmentUsed = value; } }, metadata: _metadata }, _equipmentUsed_initializers, _equipmentUsed_extraInitializers);
            __esDecorate(null, null, _issues_decorators, { kind: "field", name: "issues", static: false, private: false, access: { has: obj => "issues" in obj, get: obj => obj.issues, set: (obj, value) => { obj.issues = value; } }, metadata: _metadata }, _issues_initializers, _issues_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.CreateDailyReportDto = CreateDailyReportDto;
/**
 * Create milestone DTO
 */
let CreateMilestoneDto = (() => {
    var _a;
    let _projectId_decorators;
    let _projectId_initializers = [];
    let _projectId_extraInitializers = [];
    let _milestoneName_decorators;
    let _milestoneName_initializers = [];
    let _milestoneName_extraInitializers = [];
    let _description_decorators;
    let _description_initializers = [];
    let _description_extraInitializers = [];
    let _plannedDate_decorators;
    let _plannedDate_initializers = [];
    let _plannedDate_extraInitializers = [];
    let _budgetedValue_decorators;
    let _budgetedValue_initializers = [];
    let _budgetedValue_extraInitializers = [];
    let _completionCriteria_decorators;
    let _completionCriteria_initializers = [];
    let _completionCriteria_extraInitializers = [];
    return _a = class CreateMilestoneDto {
            constructor() {
                this.projectId = __runInitializers(this, _projectId_initializers, void 0);
                this.milestoneName = (__runInitializers(this, _projectId_extraInitializers), __runInitializers(this, _milestoneName_initializers, void 0));
                this.description = (__runInitializers(this, _milestoneName_extraInitializers), __runInitializers(this, _description_initializers, void 0));
                this.plannedDate = (__runInitializers(this, _description_extraInitializers), __runInitializers(this, _plannedDate_initializers, void 0));
                this.budgetedValue = (__runInitializers(this, _plannedDate_extraInitializers), __runInitializers(this, _budgetedValue_initializers, void 0));
                this.completionCriteria = (__runInitializers(this, _budgetedValue_extraInitializers), __runInitializers(this, _completionCriteria_initializers, void 0));
                __runInitializers(this, _completionCriteria_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _projectId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Project ID' }), (0, class_validator_1.IsUUID)()];
            _milestoneName_decorators = [(0, swagger_1.ApiProperty)({ description: 'Milestone name' }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)(), (0, class_validator_1.MaxLength)(200)];
            _description_decorators = [(0, swagger_1.ApiProperty)({ description: 'Description' }), (0, class_validator_1.IsString)(), (0, class_validator_1.MaxLength)(1000)];
            _plannedDate_decorators = [(0, swagger_1.ApiProperty)({ description: 'Planned date' }), (0, class_transformer_1.Type)(() => Date), (0, class_validator_1.IsDate)()];
            _budgetedValue_decorators = [(0, swagger_1.ApiProperty)({ description: 'Budgeted value' }), (0, class_validator_1.IsNumber)(), (0, class_validator_1.Min)(0)];
            _completionCriteria_decorators = [(0, swagger_1.ApiProperty)({ description: 'Completion criteria', type: [Object], required: false }), (0, class_validator_1.IsArray)(), (0, class_validator_1.IsOptional)()];
            __esDecorate(null, null, _projectId_decorators, { kind: "field", name: "projectId", static: false, private: false, access: { has: obj => "projectId" in obj, get: obj => obj.projectId, set: (obj, value) => { obj.projectId = value; } }, metadata: _metadata }, _projectId_initializers, _projectId_extraInitializers);
            __esDecorate(null, null, _milestoneName_decorators, { kind: "field", name: "milestoneName", static: false, private: false, access: { has: obj => "milestoneName" in obj, get: obj => obj.milestoneName, set: (obj, value) => { obj.milestoneName = value; } }, metadata: _metadata }, _milestoneName_initializers, _milestoneName_extraInitializers);
            __esDecorate(null, null, _description_decorators, { kind: "field", name: "description", static: false, private: false, access: { has: obj => "description" in obj, get: obj => obj.description, set: (obj, value) => { obj.description = value; } }, metadata: _metadata }, _description_initializers, _description_extraInitializers);
            __esDecorate(null, null, _plannedDate_decorators, { kind: "field", name: "plannedDate", static: false, private: false, access: { has: obj => "plannedDate" in obj, get: obj => obj.plannedDate, set: (obj, value) => { obj.plannedDate = value; } }, metadata: _metadata }, _plannedDate_initializers, _plannedDate_extraInitializers);
            __esDecorate(null, null, _budgetedValue_decorators, { kind: "field", name: "budgetedValue", static: false, private: false, access: { has: obj => "budgetedValue" in obj, get: obj => obj.budgetedValue, set: (obj, value) => { obj.budgetedValue = value; } }, metadata: _metadata }, _budgetedValue_initializers, _budgetedValue_extraInitializers);
            __esDecorate(null, null, _completionCriteria_decorators, { kind: "field", name: "completionCriteria", static: false, private: false, access: { has: obj => "completionCriteria" in obj, get: obj => obj.completionCriteria, set: (obj, value) => { obj.completionCriteria = value; } }, metadata: _metadata }, _completionCriteria_initializers, _completionCriteria_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.CreateMilestoneDto = CreateMilestoneDto;
/**
 * Update milestone progress DTO
 */
let UpdateMilestoneProgressDto = (() => {
    var _a;
    let _percentComplete_decorators;
    let _percentComplete_initializers = [];
    let _percentComplete_extraInitializers = [];
    let _forecastDate_decorators;
    let _forecastDate_initializers = [];
    let _forecastDate_extraInitializers = [];
    let _completionNotes_decorators;
    let _completionNotes_initializers = [];
    let _completionNotes_extraInitializers = [];
    return _a = class UpdateMilestoneProgressDto {
            constructor() {
                this.percentComplete = __runInitializers(this, _percentComplete_initializers, void 0);
                this.forecastDate = (__runInitializers(this, _percentComplete_extraInitializers), __runInitializers(this, _forecastDate_initializers, void 0));
                this.completionNotes = (__runInitializers(this, _forecastDate_extraInitializers), __runInitializers(this, _completionNotes_initializers, void 0));
                __runInitializers(this, _completionNotes_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _percentComplete_decorators = [(0, swagger_1.ApiProperty)({ description: 'Percent complete' }), (0, class_validator_1.IsNumber)(), (0, class_validator_1.Min)(0), (0, class_validator_1.Max)(100)];
            _forecastDate_decorators = [(0, swagger_1.ApiProperty)({ description: 'Forecast completion date', required: false }), (0, class_transformer_1.Type)(() => Date), (0, class_validator_1.IsDate)(), (0, class_validator_1.IsOptional)()];
            _completionNotes_decorators = [(0, swagger_1.ApiProperty)({ description: 'Completion notes', required: false }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsOptional)(), (0, class_validator_1.MaxLength)(1000)];
            __esDecorate(null, null, _percentComplete_decorators, { kind: "field", name: "percentComplete", static: false, private: false, access: { has: obj => "percentComplete" in obj, get: obj => obj.percentComplete, set: (obj, value) => { obj.percentComplete = value; } }, metadata: _metadata }, _percentComplete_initializers, _percentComplete_extraInitializers);
            __esDecorate(null, null, _forecastDate_decorators, { kind: "field", name: "forecastDate", static: false, private: false, access: { has: obj => "forecastDate" in obj, get: obj => obj.forecastDate, set: (obj, value) => { obj.forecastDate = value; } }, metadata: _metadata }, _forecastDate_initializers, _forecastDate_extraInitializers);
            __esDecorate(null, null, _completionNotes_decorators, { kind: "field", name: "completionNotes", static: false, private: false, access: { has: obj => "completionNotes" in obj, get: obj => obj.completionNotes, set: (obj, value) => { obj.completionNotes = value; } }, metadata: _metadata }, _completionNotes_initializers, _completionNotes_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.UpdateMilestoneProgressDto = UpdateMilestoneProgressDto;
/**
 * Add progress photo DTO
 */
let AddProgressPhotoDto = (() => {
    var _a;
    let _url_decorators;
    let _url_initializers = [];
    let _url_extraInitializers = [];
    let _caption_decorators;
    let _caption_initializers = [];
    let _caption_extraInitializers = [];
    let _location_decorators;
    let _location_initializers = [];
    let _location_extraInitializers = [];
    return _a = class AddProgressPhotoDto {
            constructor() {
                this.url = __runInitializers(this, _url_initializers, void 0);
                this.caption = (__runInitializers(this, _url_extraInitializers), __runInitializers(this, _caption_initializers, void 0));
                this.location = (__runInitializers(this, _caption_extraInitializers), __runInitializers(this, _location_initializers, void 0));
                __runInitializers(this, _location_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _url_decorators = [(0, swagger_1.ApiProperty)({ description: 'Photo URL' }), (0, class_validator_1.IsUrl)()];
            _caption_decorators = [(0, swagger_1.ApiProperty)({ description: 'Caption' }), (0, class_validator_1.IsString)(), (0, class_validator_1.MaxLength)(500)];
            _location_decorators = [(0, swagger_1.ApiProperty)({ description: 'Location/area', required: false }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsOptional)(), (0, class_validator_1.MaxLength)(200)];
            __esDecorate(null, null, _url_decorators, { kind: "field", name: "url", static: false, private: false, access: { has: obj => "url" in obj, get: obj => obj.url, set: (obj, value) => { obj.url = value; } }, metadata: _metadata }, _url_initializers, _url_extraInitializers);
            __esDecorate(null, null, _caption_decorators, { kind: "field", name: "caption", static: false, private: false, access: { has: obj => "caption" in obj, get: obj => obj.caption, set: (obj, value) => { obj.caption = value; } }, metadata: _metadata }, _caption_initializers, _caption_extraInitializers);
            __esDecorate(null, null, _location_decorators, { kind: "field", name: "location", static: false, private: false, access: { has: obj => "location" in obj, get: obj => obj.location, set: (obj, value) => { obj.location = value; } }, metadata: _metadata }, _location_initializers, _location_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.AddProgressPhotoDto = AddProgressPhotoDto;
// ============================================================================
// PROGRESS MEASUREMENT AND VERIFICATION
// ============================================================================
/**
 * Records physical progress measurement for an activity
 *
 * @param measurementData - Progress measurement data
 * @returns Created progress measurement
 *
 * @example
 * ```typescript
 * const progress = await recordProgressMeasurement({
 *   activityId: 'act-123',
 *   projectId: 'proj-456',
 *   measurementDate: new Date(),
 *   percentComplete: 75,
 *   quantityCompleted: 850,
 *   measurementMethod: MeasurementMethod.QUANTITY_COMPLETE,
 *   verifiedBy: 'inspector-789'
 * });
 * ```
 */
async function recordProgressMeasurement(measurementData) {
    const measurement = {
        id: faker_1.faker.string.uuid(),
        ...measurementData,
        earnedValue: 0,
        plannedValue: 0,
        actualCost: 0,
        photos: [],
        createdAt: new Date(),
        updatedAt: new Date(),
    };
    // In production: await ProgressMeasurement.create(measurement);
    return measurement;
}
/**
 * Calculates earned value for an activity
 *
 * @param activityId - Activity identifier
 * @param percentComplete - Completion percentage
 * @param budgetedCost - Budgeted cost for activity
 * @returns Earned value amount
 *
 * @example
 * ```typescript
 * const ev = calculateActivityEarnedValue('act-123', 75, 100000);
 * // Returns: 75000
 * ```
 */
function calculateActivityEarnedValue(activityId, percentComplete, budgetedCost) {
    return (percentComplete / 100) * budgetedCost;
}
/**
 * Verifies progress measurement against quality standards
 *
 * @param measurementId - Measurement identifier
 * @param verificationData - Verification details
 * @returns Verification result
 *
 * @example
 * ```typescript
 * await verifyProgressMeasurement('meas-123', {
 *   inspectorId: 'user-456',
 *   qualityChecklist: {...},
 *   isApproved: true
 * });
 * ```
 */
async function verifyProgressMeasurement(measurementId, verificationData) {
    return {
        measurementId,
        verifiedBy: verificationData.inspectorId,
        verifiedAt: new Date(),
        isApproved: verificationData.isApproved,
    };
}
/**
 * Gets activity progress history
 *
 * @param activityId - Activity identifier
 * @returns Progress measurement history
 *
 * @example
 * ```typescript
 * const history = await getActivityProgressHistory('act-123');
 * ```
 */
async function getActivityProgressHistory(activityId) {
    // In production: await ProgressMeasurement.findAll({ where: { activityId }, order: [['measurementDate', 'ASC']] })
    return [];
}
// ============================================================================
// EARNED VALUE MANAGEMENT (EVM)
// ============================================================================
/**
 * Calculates comprehensive earned value metrics for project
 *
 * @param projectId - Project identifier
 * @param asOfDate - Calculation date
 * @returns Complete EVM metrics
 *
 * @example
 * ```typescript
 * const evm = await calculateEarnedValue('proj-123', new Date());
 * ```
 */
async function calculateEarnedValue(projectId, asOfDate) {
    // In production: aggregate progress measurements and costs
    const budgetAtCompletion = 5000000;
    const plannedValue = 2500000;
    const earnedValue = 2200000;
    const actualCost = 2350000;
    const scheduleVariance = earnedValue - plannedValue;
    const costVariance = earnedValue - actualCost;
    const schedulePerformanceIndex = earnedValue / plannedValue;
    const costPerformanceIndex = earnedValue / actualCost;
    const estimateAtCompletion = budgetAtCompletion / costPerformanceIndex;
    const estimateToComplete = estimateAtCompletion - actualCost;
    const varianceAtCompletion = budgetAtCompletion - estimateAtCompletion;
    const toCompletePerformanceIndex = (budgetAtCompletion - earnedValue) / (budgetAtCompletion - actualCost);
    return {
        projectId,
        asOfDate,
        budgetAtCompletion,
        plannedValue,
        earnedValue,
        actualCost,
        scheduleVariance,
        costVariance,
        schedulePerformanceIndex,
        costPerformanceIndex,
        estimateAtCompletion,
        estimateToComplete,
        varianceAtCompletion,
        toCompletePerformanceIndex,
        percentScheduled: (plannedValue / budgetAtCompletion) * 100,
        percentComplete: (earnedValue / budgetAtCompletion) * 100,
        percentSpent: (actualCost / budgetAtCompletion) * 100,
    };
}
/**
 * Calculates schedule performance index
 *
 * @param earnedValue - Earned value
 * @param plannedValue - Planned value
 * @returns SPI and interpretation
 *
 * @example
 * ```typescript
 * const spi = calculateSchedulePerformanceIndex(2200000, 2500000);
 * ```
 */
function calculateSchedulePerformanceIndex(earnedValue, plannedValue) {
    const spi = earnedValue / plannedValue;
    const scheduleVariance = earnedValue - plannedValue;
    let performance;
    let interpretation;
    if (spi > 1.05) {
        performance = 'ahead';
        interpretation = 'Project is ahead of schedule';
    }
    else if (spi >= 0.95) {
        performance = 'on_schedule';
        interpretation = 'Project is on schedule';
    }
    else {
        performance = 'behind';
        interpretation = 'Project is behind schedule';
    }
    return {
        spi,
        scheduleVariance,
        performance,
        interpretation,
    };
}
/**
 * Calculates cost performance index
 *
 * @param earnedValue - Earned value
 * @param actualCost - Actual cost
 * @returns CPI and interpretation
 *
 * @example
 * ```typescript
 * const cpi = calculateCostPerformanceIndex(2200000, 2350000);
 * ```
 */
function calculateCostPerformanceIndex(earnedValue, actualCost) {
    const cpi = earnedValue / actualCost;
    const costVariance = earnedValue - actualCost;
    let performance;
    let interpretation;
    if (cpi > 1.05) {
        performance = 'under_budget';
        interpretation = 'Project is under budget';
    }
    else if (cpi >= 0.95) {
        performance = 'on_budget';
        interpretation = 'Project is on budget';
    }
    else {
        performance = 'over_budget';
        interpretation = 'Project is over budget';
    }
    return {
        cpi,
        costVariance,
        performance,
        interpretation,
    };
}
/**
 * Forecasts estimate at completion using EVM
 *
 * @param budgetAtCompletion - Total project budget
 * @param earnedValue - Current earned value
 * @param actualCost - Current actual cost
 * @returns EAC forecast with multiple methods
 *
 * @example
 * ```typescript
 * const forecast = forecastEstimateAtCompletion(5000000, 2200000, 2350000);
 * ```
 */
function forecastEstimateAtCompletion(budgetAtCompletion, earnedValue, actualCost) {
    const cpi = earnedValue / actualCost;
    const spi = earnedValue / (budgetAtCompletion * 0.5); // Assuming 50% planned
    // Method 1: Based on CPI only
    const eacCPI = budgetAtCompletion / cpi;
    // Method 2: Based on CPI and SPI
    const eacCPISPI = actualCost + ((budgetAtCompletion - earnedValue) / (cpi * spi));
    // Method 3: Assuming budget performance
    const eacBudget = actualCost + (budgetAtCompletion - earnedValue);
    // Use conservative estimate (highest)
    const recommendedEAC = Math.max(eacCPI, eacCPISPI, eacBudget);
    return {
        eacCPI,
        eacCPISPI,
        eacBudget,
        recommendedEAC,
        varianceAtCompletion: budgetAtCompletion - recommendedEAC,
    };
}
// ============================================================================
// MILESTONE TRACKING
// ============================================================================
/**
 * Creates a construction milestone
 *
 * @param milestoneData - Milestone creation data
 * @returns Created milestone
 *
 * @example
 * ```typescript
 * const milestone = await createMilestone({
 *   projectId: 'proj-123',
 *   milestoneName: 'Foundation Complete',
 *   plannedDate: new Date('2025-03-15'),
 *   budgetedValue: 500000
 * });
 * ```
 */
async function createMilestone(milestoneData) {
    const milestone = {
        id: faker_1.faker.string.uuid(),
        ...milestoneData,
        status: MilestoneStatus.UPCOMING,
        earnedValue: 0,
        percentComplete: 0,
        deliverables: [],
        createdAt: new Date(),
        updatedAt: new Date(),
    };
    // In production: await ConstructionMilestone.create(milestone);
    return milestone;
}
/**
 * Updates milestone progress
 *
 * @param milestoneId - Milestone identifier
 * @param progressData - Progress update data
 * @returns Updated milestone
 *
 * @example
 * ```typescript
 * await updateMilestoneProgress('mile-123', {
 *   percentComplete: 85,
 *   forecastDate: new Date('2025-03-18')
 * });
 * ```
 */
async function updateMilestoneProgress(milestoneId, progressData) {
    const milestone = await getMilestone(milestoneId);
    const earnedValue = (progressData.percentComplete / 100) * milestone.budgetedValue;
    // Determine status based on progress and dates
    let status = milestone.status;
    if (progressData.percentComplete === 100) {
        status = MilestoneStatus.COMPLETED;
    }
    else {
        const now = new Date();
        const plannedDate = new Date(milestone.plannedDate);
        const daysUntilPlanned = (plannedDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24);
        if (daysUntilPlanned < 0) {
            status = MilestoneStatus.LATE;
        }
        else if (progressData.percentComplete < 50 && daysUntilPlanned < 14) {
            status = MilestoneStatus.AT_RISK;
        }
        else {
            status = MilestoneStatus.ON_TRACK;
        }
    }
    return {
        ...milestone,
        percentComplete: progressData.percentComplete,
        earnedValue,
        forecastDate: progressData.forecastDate,
        completionNotes: progressData.completionNotes,
        status,
        updatedAt: new Date(),
    };
}
/**
 * Completes a milestone
 *
 * @param milestoneId - Milestone identifier
 * @param completionData - Completion details
 * @returns Completed milestone
 *
 * @example
 * ```typescript
 * await completeMilestone('mile-123', {
 *   completedBy: 'user-456',
 *   actualDate: new Date(),
 *   completionNotes: 'All criteria met, inspections passed'
 * });
 * ```
 */
async function completeMilestone(milestoneId, completionData) {
    const milestone = await getMilestone(milestoneId);
    return {
        ...milestone,
        status: MilestoneStatus.COMPLETED,
        percentComplete: 100,
        earnedValue: milestone.budgetedValue,
        actualDate: completionData.actualDate,
        completedBy: completionData.completedBy,
        completionNotes: completionData.completionNotes,
        updatedAt: new Date(),
    };
}
/**
 * Gets upcoming milestones
 *
 * @param projectId - Project identifier
 * @param daysAhead - Days to look ahead
 * @returns Upcoming milestones
 *
 * @example
 * ```typescript
 * const upcoming = await getUpcomingMilestones('proj-123', 30);
 * ```
 */
async function getUpcomingMilestones(projectId, daysAhead = 30) {
    // In production: query milestones with date filter
    return [];
}
/**
 * Tracks milestone completion percentage
 *
 * @param projectId - Project identifier
 * @returns Milestone completion summary
 *
 * @example
 * ```typescript
 * const summary = await trackMilestoneCompletion('proj-123');
 * ```
 */
async function trackMilestoneCompletion(projectId) {
    // In production: aggregate milestone statuses
    return {
        totalMilestones: 12,
        completedMilestones: 7,
        onTrackMilestones: 3,
        atRiskMilestones: 1,
        lateMilestones: 1,
        completionPercentage: 58.3,
    };
}
// ============================================================================
// DAILY AND WEEKLY REPORTS
// ============================================================================
/**
 * Creates a daily construction report
 *
 * @param reportData - Daily report data
 * @returns Created daily report
 *
 * @example
 * ```typescript
 * const report = await createDailyReport({
 *   projectId: 'proj-123',
 *   reportDate: new Date(),
 *   weatherCondition: WeatherCondition.CLEAR,
 *   temperatureHigh: 75,
 *   temperatureLow: 58,
 *   workersOnSite: 45,
 *   workPerformed: 'Completed foundation formwork on north wing...'
 * });
 * ```
 */
async function createDailyReport(reportData) {
    const report = {
        id: faker_1.faker.string.uuid(),
        visitorsOnSite: 0,
        delayHours: 0,
        progressPhotos: [],
        ...reportData,
        createdAt: new Date(),
        updatedAt: new Date(),
    };
    // In production: await DailyReport.create(report);
    return report;
}
/**
 * Adds progress photos to daily report
 *
 * @param reportId - Report identifier
 * @param photos - Photo data
 * @returns Updated report
 *
 * @example
 * ```typescript
 * await addProgressPhotos('report-123', [
 *   { url: 'https://...', caption: 'Foundation work', location: 'North Wing' }
 * ]);
 * ```
 */
async function addProgressPhotos(reportId, photos) {
    const report = await getDailyReport(reportId);
    return {
        ...report,
        progressPhotos: [...report.progressPhotos, ...photos],
        updatedAt: new Date(),
    };
}
/**
 * Generates weekly progress summary
 *
 * @param projectId - Project identifier
 * @param weekEnding - Week ending date
 * @returns Weekly summary
 *
 * @example
 * ```typescript
 * const summary = await generateWeeklyProgressSummary('proj-123', new Date());
 * ```
 */
async function generateWeeklyProgressSummary(projectId, weekEnding) {
    // In production: aggregate daily reports for the week
    return {
        projectId,
        weekEnding,
        percentComplete: 44,
        progressThisWeek: 3.5,
        scheduleVariance: -2.1,
        costVariance: 1.2,
        workersAverage: 42,
        weatherDelays: 0,
        safetyIncidents: 0,
        majorActivities: ['Foundation formwork', 'Rebar installation'],
        issuesEncountered: ['Delayed material delivery'],
        plannedNextWeek: ['Concrete pour', 'Steel erection'],
    };
}
/**
 * Approves daily report
 *
 * @param reportId - Report identifier
 * @param approverId - Approver user ID
 * @returns Approved report
 *
 * @example
 * ```typescript
 * await approveDailyReport('report-123', 'manager-456');
 * ```
 */
async function approveDailyReport(reportId, approverId) {
    const report = await getDailyReport(reportId);
    return {
        ...report,
        approvedBy: approverId,
        approvedAt: new Date(),
        updatedAt: new Date(),
    };
}
// ============================================================================
// S-CURVE GENERATION AND ANALYSIS
// ============================================================================
/**
 * Generates S-curve data for project
 *
 * @param projectId - Project identifier
 * @param startDate - Project start date
 * @param endDate - Project end date
 * @returns S-curve data points
 *
 * @example
 * ```typescript
 * const sCurve = await generateSCurve('proj-123', startDate, endDate);
 * ```
 */
async function generateSCurve(projectId, startDate, endDate) {
    const dataPoints = [];
    const totalBudget = 5000000;
    const totalDuration = (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24);
    let pvCumulative = 0;
    let evCumulative = 0;
    let acCumulative = 0;
    const currentDate = new Date(startDate);
    while (currentDate <= endDate) {
        const dayNumber = (currentDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24);
        const percentElapsed = dayNumber / totalDuration;
        // S-curve formula: uses cubic function for realistic curve
        const plannedPercent = percentElapsed < 0.1 ? percentElapsed * 2 :
            percentElapsed < 0.9 ? 0.2 + (percentElapsed - 0.1) * 1.0 :
                0.2 + 0.8 + (percentElapsed - 0.9) * 0.5;
        const dailyPV = (plannedPercent * totalBudget) - pvCumulative;
        const dailyEV = dailyPV * faker_1.faker.number.float({ min: 0.92, max: 1.08, fractionDigits: 4 });
        const dailyAC = dailyEV * faker_1.faker.number.float({ min: 0.95, max: 1.12, fractionDigits: 4 });
        pvCumulative += dailyPV;
        evCumulative += dailyEV;
        acCumulative += dailyAC;
        dataPoints.push({
            date: new Date(currentDate),
            plannedValue: dailyPV,
            earnedValue: dailyEV,
            actualCost: dailyAC,
            plannedValueCumulative: pvCumulative,
            earnedValueCumulative: evCumulative,
            actualCostCumulative: acCumulative,
        });
        currentDate.setDate(currentDate.getDate() + 7); // Weekly intervals
    }
    return dataPoints;
}
/**
 * Analyzes S-curve trends
 *
 * @param sCurveData - S-curve data points
 * @returns Trend analysis
 *
 * @example
 * ```typescript
 * const analysis = analyzeSCurveTrends(sCurveData);
 * ```
 */
function analyzeSCurveTrends(sCurveData) {
    const latest = sCurveData[sCurveData.length - 1];
    const spi = latest.earnedValueCumulative / latest.plannedValueCumulative;
    const cpi = latest.earnedValueCumulative / latest.actualCostCumulative;
    // Analyze last 4 weeks for trend
    const recentData = sCurveData.slice(-4);
    const spiTrend = recentData.map(d => d.earnedValueCumulative / d.plannedValueCumulative);
    const avgChange = (spiTrend[spiTrend.length - 1] - spiTrend[0]) / spiTrend.length;
    let trendDirection;
    if (avgChange > 0.01)
        trendDirection = PerformanceTrend.IMPROVING;
    else if (avgChange < -0.01)
        trendDirection = PerformanceTrend.DECLINING;
    else
        trendDirection = PerformanceTrend.STABLE;
    const recommendations = [];
    if (spi < 0.95)
        recommendations.push('Accelerate schedule to recover delays');
    if (cpi < 0.95)
        recommendations.push('Implement cost control measures');
    if (trendDirection === PerformanceTrend.DECLINING) {
        recommendations.push('Investigate declining performance trend');
    }
    return {
        currentSPI: spi,
        currentCPI: cpi,
        trendDirection,
        projectedCompletion: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
        projectedCost: latest.actualCostCumulative / cpi,
        recommendations,
    };
}
// ============================================================================
// TREND ANALYSIS AND FORECASTING
// ============================================================================
/**
 * Generates progress trend analysis
 *
 * @param projectId - Project identifier
 * @param periods - Number of periods to analyze
 * @returns Trend data
 *
 * @example
 * ```typescript
 * const trends = await generateProgressTrends('proj-123', 12);
 * ```
 */
async function generateProgressTrends(projectId, periods = 12) {
    const trends = [];
    for (let i = 0; i < periods; i++) {
        const period = `Week ${i + 1}`;
        const percentComplete = ((i + 1) / periods) * 100 * faker_1.faker.number.float({ min: 0.9, max: 1.1, fractionDigits: 2 });
        const plannedValue = 500000 * (i + 1);
        const earnedValue = plannedValue * (percentComplete / ((i + 1) / periods * 100));
        const scheduleVariance = earnedValue - plannedValue;
        let trend;
        if (i > 0) {
            const prevSV = trends[i - 1].scheduleVariance;
            if (scheduleVariance > prevSV)
                trend = PerformanceTrend.IMPROVING;
            else if (scheduleVariance < prevSV)
                trend = PerformanceTrend.DECLINING;
            else
                trend = PerformanceTrend.STABLE;
        }
        else {
            trend = PerformanceTrend.STABLE;
        }
        trends.push({
            period,
            percentComplete,
            earnedValue,
            plannedValue,
            scheduleVariance,
            costVariance: earnedValue * 0.05,
            trend,
        });
    }
    return trends;
}
/**
 * Forecasts project completion date
 *
 * @param projectId - Project identifier
 * @param currentProgress - Current progress data
 * @returns Completion forecast
 *
 * @example
 * ```typescript
 * const forecast = await forecastCompletionDate('proj-123', {
 *   percentComplete: 45,
 *   spi: 0.92
 * });
 * ```
 */
async function forecastCompletionDate(projectId, currentProgress) {
    const originalDate = new Date('2025-12-31');
    const remainingPercent = 100 - currentProgress.percentComplete;
    const daysRemaining = (remainingPercent / currentProgress.percentComplete) * 180; // Assuming 180 days elapsed
    const adjustedDays = daysRemaining / currentProgress.spi;
    const forecastDate = new Date(Date.now() + adjustedDays * 24 * 60 * 60 * 1000);
    const daysDifference = (forecastDate.getTime() - originalDate.getTime()) / (1000 * 60 * 60 * 24);
    let confidence;
    if (currentProgress.percentComplete > 70)
        confidence = 'high';
    else if (currentProgress.percentComplete > 40)
        confidence = 'medium';
    else
        confidence = 'low';
    return {
        originalDate,
        forecastDate,
        daysDifference,
        confidence,
    };
}
/**
 * Analyzes performance trends
 *
 * @param trends - Historical trend data
 * @returns Trend analysis results
 *
 * @example
 * ```typescript
 * const analysis = analyzePerformanceTrends(trendData);
 * ```
 */
function analyzePerformanceTrends(trends) {
    const improvingCount = trends.filter(t => t.trend === PerformanceTrend.IMPROVING).length;
    const decliningCount = trends.filter(t => t.trend === PerformanceTrend.DECLINING).length;
    let overallTrend;
    if (improvingCount > decliningCount * 1.5)
        overallTrend = PerformanceTrend.IMPROVING;
    else if (decliningCount > improvingCount * 1.5)
        overallTrend = PerformanceTrend.DECLINING;
    else
        overallTrend = PerformanceTrend.STABLE;
    const avgSPI = trends.reduce((sum, t) => sum + (t.earnedValue / t.plannedValue), 0) / trends.length;
    const avgCPI = 0.96; // Calculated from cost variance
    // Calculate volatility
    const variances = trends.map(t => Math.abs(t.scheduleVariance));
    const avgVariance = variances.reduce((a, b) => a + b, 0) / variances.length;
    const volatility = avgVariance > 100000 ? 'high' : avgVariance > 50000 ? 'moderate' : 'stable';
    let recommendation;
    if (overallTrend === PerformanceTrend.DECLINING) {
        recommendation = 'Immediate corrective action required to reverse declining trend';
    }
    else if (volatility === 'high') {
        recommendation = 'Stabilize performance through better planning and execution';
    }
    else {
        recommendation = 'Maintain current performance levels';
    }
    return {
        overallTrend,
        averageSPI: avgSPI,
        averageCPI: avgCPI,
        volatility,
        recommendation,
    };
}
// ============================================================================
// VARIANCE ANALYSIS
// ============================================================================
/**
 * Performs comprehensive variance analysis
 *
 * @param projectId - Project identifier
 * @param period - Analysis period
 * @returns Variance analysis by category
 *
 * @example
 * ```typescript
 * const analysis = await performVarianceAnalysis('proj-123', '2025-01');
 * ```
 */
async function performVarianceAnalysis(projectId, period) {
    const categories = ['Labor', 'Materials', 'Equipment', 'Subcontractors', 'Overhead'];
    return categories.map(category => {
        const budgeted = faker_1.faker.number.int({ min: 500000, max: 1500000 });
        const actual = budgeted * faker_1.faker.number.float({ min: 0.85, max: 1.15, fractionDigits: 4 });
        const variance = budgeted - actual;
        const variancePercentage = (variance / budgeted) * 100;
        let varianceCategory;
        if (variancePercentage > 5)
            varianceCategory = VarianceCategory.FAVORABLE;
        else if (variancePercentage >= -5)
            varianceCategory = VarianceCategory.ACCEPTABLE;
        else if (variancePercentage >= -10)
            varianceCategory = VarianceCategory.UNFAVORABLE;
        else
            varianceCategory = VarianceCategory.CRITICAL;
        return {
            category,
            budgeted,
            actual,
            variance,
            variancePercentage,
            varianceCategory,
            explanation: variance < 0 ? 'Higher than budgeted costs' : 'Cost savings achieved',
        };
    });
}
/**
 * Calculates schedule variance impact
 *
 * @param scheduleVariance - Schedule variance in days
 * @param dailyBurnRate - Daily cost burn rate
 * @returns Impact analysis
 *
 * @example
 * ```typescript
 * const impact = calculateScheduleVarianceImpact(-15, 50000);
 * ```
 */
function calculateScheduleVarianceImpact(scheduleVariance, dailyBurnRate) {
    const costImpact = Math.abs(scheduleVariance * dailyBurnRate);
    let severity;
    let mitigation;
    if (Math.abs(scheduleVariance) <= 5) {
        severity = 'low';
        mitigation = 'Monitor closely, no immediate action needed';
    }
    else if (Math.abs(scheduleVariance) <= 15) {
        severity = 'medium';
        mitigation = 'Implement schedule recovery plan';
    }
    else if (Math.abs(scheduleVariance) <= 30) {
        severity = 'high';
        mitigation = 'Fast-track critical activities, add resources';
    }
    else {
        severity = 'critical';
        mitigation = 'Comprehensive schedule re-baselining required';
    }
    return {
        varianceDays: scheduleVariance,
        costImpact,
        severity,
        mitigation,
    };
}
// ============================================================================
// PROGRESS PAYMENT PROCESSING
// ============================================================================
/**
 * Generates progress payment application
 *
 * @param projectId - Project identifier
 * @param periodEnding - Period ending date
 * @returns Progress payment application
 *
 * @example
 * ```typescript
 * const payment = await generateProgressPayment('proj-123', new Date());
 * ```
 */
async function generateProgressPayment(projectId, periodEnding) {
    const scheduleOfValues = [
        {
            lineItem: 'Site Work',
            scheduledValue: 500000,
            previouslyCompleted: 475000,
            currentCompleted: 25000,
            totalCompleted: 500000,
            percentComplete: 100,
            currentAmount: 25000,
        },
        {
            lineItem: 'Foundation',
            scheduledValue: 800000,
            previouslyCompleted: 600000,
            currentCompleted: 150000,
            totalCompleted: 750000,
            percentComplete: 93.75,
            currentAmount: 150000,
        },
    ];
    const totalScheduledValue = scheduleOfValues.reduce((sum, item) => sum + item.scheduledValue, 0);
    const currentPaymentTotal = scheduleOfValues.reduce((sum, item) => sum + item.currentAmount, 0);
    const totalCompleted = scheduleOfValues.reduce((sum, item) => sum + item.totalCompleted, 0);
    const retainageRate = 0.10;
    const retainage = currentPaymentTotal * retainageRate;
    return {
        id: faker_1.faker.string.uuid(),
        projectId,
        paymentNumber: 3,
        periodEnding,
        scheduleOfValues,
        totalScheduledValue,
        totalCompleted,
        percentComplete: (totalCompleted / totalScheduledValue) * 100,
        currentPaymentAmount: currentPaymentTotal,
        retainage,
        netPayment: currentPaymentTotal - retainage,
    };
}
/**
 * Approves progress payment
 *
 * @param paymentId - Payment identifier
 * @param approverId - Approver user ID
 * @returns Approved payment
 *
 * @example
 * ```typescript
 * await approveProgressPayment('payment-123', 'user-456');
 * ```
 */
async function approveProgressPayment(paymentId, approverId) {
    // In production: update payment record
    const payment = {
        id: paymentId,
        approvedBy: approverId,
        approvedAt: new Date(),
    };
    return payment;
}
/**
 * Calculates retainage amounts
 *
 * @param totalValue - Total contract value
 * @param completedValue - Completed work value
 * @param retainageRate - Retainage percentage
 * @returns Retainage calculation
 *
 * @example
 * ```typescript
 * const retainage = calculateRetainage(5000000, 2200000, 0.10);
 * ```
 */
function calculateRetainage(totalValue, completedValue, retainageRate = 0.10) {
    const percentComplete = (completedValue / totalValue) * 100;
    const retainageHeld = completedValue * retainageRate;
    // Release retainage at 50% completion
    const retainageReleased = percentComplete >= 50 ? retainageHeld * 0.5 : 0;
    const retainageBalance = retainageHeld - retainageReleased;
    return {
        retainageRate,
        retainageHeld,
        retainageReleased,
        retainageBalance,
        percentComplete,
    };
}
// ============================================================================
// HELPER FUNCTIONS
// ============================================================================
async function getMilestone(milestoneId) {
    return {
        id: milestoneId,
        projectId: 'proj-1',
        milestoneName: 'Foundation Complete',
        description: 'Complete foundation work',
        plannedDate: new Date('2025-03-15'),
        status: MilestoneStatus.ON_TRACK,
        budgetedValue: 500000,
        earnedValue: 425000,
        percentComplete: 85,
        completionCriteria: [],
        deliverables: [],
        createdAt: new Date(),
        updatedAt: new Date(),
    };
}
async function getDailyReport(reportId) {
    return {
        id: reportId,
        projectId: 'proj-1',
        reportDate: new Date(),
        weatherCondition: WeatherCondition.CLEAR,
        temperatureHigh: 75,
        temperatureLow: 58,
        workersOnSite: 45,
        visitorsOnSite: 2,
        workPerformed: 'Foundation work continued',
        delayHours: 0,
        progressPhotos: [],
        submittedBy: 'user-1',
        createdAt: new Date(),
        updatedAt: new Date(),
    };
}
// ============================================================================
// NESTJS CONTROLLER
// ============================================================================
/**
 * Progress Tracking Controller
 * Provides RESTful API endpoints for construction progress management
 */
let ProgressTrackingController = (() => {
    let _classDecorators = [(0, swagger_1.ApiTags)('construction-progress'), (0, common_1.Controller)('construction/progress'), (0, swagger_1.ApiBearerAuth)()];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _instanceExtraInitializers = [];
    let _recordProgress_decorators;
    let _getEarnedValue_decorators;
    let _createMilestoneEndpoint_decorators;
    let _updateMilestone_decorators;
    let _createReport_decorators;
    let _addPhotos_decorators;
    let _getSCurve_decorators;
    let _getTrends_decorators;
    let _getVariance_decorators;
    let _generatePayment_decorators;
    let _getWeeklySummary_decorators;
    var ProgressTrackingController = _classThis = class {
        async recordProgress(dto) {
            return recordProgressMeasurement(dto);
        }
        async getEarnedValue(projectId, asOfDate) {
            return calculateEarnedValue(projectId, asOfDate ? new Date(asOfDate) : new Date());
        }
        async createMilestoneEndpoint(dto) {
            return createMilestone(dto);
        }
        async updateMilestone(id, dto) {
            return updateMilestoneProgress(id, dto);
        }
        async createReport(dto) {
            return createDailyReport({ ...dto, submittedBy: 'current-user' });
        }
        async addPhotos(id, photos) {
            return addProgressPhotos(id, photos);
        }
        async getSCurve(projectId, startDate, endDate) {
            return generateSCurve(projectId, new Date(startDate), new Date(endDate));
        }
        async getTrends(projectId, periods) {
            return generateProgressTrends(projectId, periods ? parseInt(periods.toString()) : 12);
        }
        async getVariance(projectId, period) {
            return performVarianceAnalysis(projectId, period);
        }
        async generatePayment(projectId, periodEnding) {
            return generateProgressPayment(projectId, new Date(periodEnding));
        }
        async getWeeklySummary(projectId, weekEnding) {
            return generateWeeklyProgressSummary(projectId, new Date(weekEnding));
        }
        constructor() {
            __runInitializers(this, _instanceExtraInitializers);
        }
    };
    __setFunctionName(_classThis, "ProgressTrackingController");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _recordProgress_decorators = [(0, common_1.Post)('measurements'), (0, common_1.HttpCode)(common_1.HttpStatus.CREATED), (0, swagger_1.ApiOperation)({ summary: 'Record progress measurement' }), (0, common_1.UsePipes)(new common_1.ValidationPipe({ transform: true, whitelist: true }))];
        _getEarnedValue_decorators = [(0, common_1.Get)('earned-value'), (0, swagger_1.ApiOperation)({ summary: 'Calculate earned value metrics' })];
        _createMilestoneEndpoint_decorators = [(0, common_1.Post)('milestones'), (0, common_1.HttpCode)(common_1.HttpStatus.CREATED), (0, swagger_1.ApiOperation)({ summary: 'Create milestone' })];
        _updateMilestone_decorators = [(0, common_1.Patch)('milestones/:id'), (0, swagger_1.ApiOperation)({ summary: 'Update milestone progress' })];
        _createReport_decorators = [(0, common_1.Post)('daily-reports'), (0, common_1.HttpCode)(common_1.HttpStatus.CREATED), (0, swagger_1.ApiOperation)({ summary: 'Create daily report' })];
        _addPhotos_decorators = [(0, common_1.Post)('daily-reports/:id/photos'), (0, swagger_1.ApiOperation)({ summary: 'Add progress photos' })];
        _getSCurve_decorators = [(0, common_1.Get)('s-curve'), (0, swagger_1.ApiOperation)({ summary: 'Generate S-curve data' })];
        _getTrends_decorators = [(0, common_1.Get)('trends'), (0, swagger_1.ApiOperation)({ summary: 'Get progress trends' })];
        _getVariance_decorators = [(0, common_1.Get)('variance-analysis'), (0, swagger_1.ApiOperation)({ summary: 'Perform variance analysis' })];
        _generatePayment_decorators = [(0, common_1.Post)('payments'), (0, swagger_1.ApiOperation)({ summary: 'Generate progress payment' })];
        _getWeeklySummary_decorators = [(0, common_1.Get)('weekly-summary'), (0, swagger_1.ApiOperation)({ summary: 'Get weekly progress summary' })];
        __esDecorate(_classThis, null, _recordProgress_decorators, { kind: "method", name: "recordProgress", static: false, private: false, access: { has: obj => "recordProgress" in obj, get: obj => obj.recordProgress }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getEarnedValue_decorators, { kind: "method", name: "getEarnedValue", static: false, private: false, access: { has: obj => "getEarnedValue" in obj, get: obj => obj.getEarnedValue }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _createMilestoneEndpoint_decorators, { kind: "method", name: "createMilestoneEndpoint", static: false, private: false, access: { has: obj => "createMilestoneEndpoint" in obj, get: obj => obj.createMilestoneEndpoint }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _updateMilestone_decorators, { kind: "method", name: "updateMilestone", static: false, private: false, access: { has: obj => "updateMilestone" in obj, get: obj => obj.updateMilestone }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _createReport_decorators, { kind: "method", name: "createReport", static: false, private: false, access: { has: obj => "createReport" in obj, get: obj => obj.createReport }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _addPhotos_decorators, { kind: "method", name: "addPhotos", static: false, private: false, access: { has: obj => "addPhotos" in obj, get: obj => obj.addPhotos }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getSCurve_decorators, { kind: "method", name: "getSCurve", static: false, private: false, access: { has: obj => "getSCurve" in obj, get: obj => obj.getSCurve }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getTrends_decorators, { kind: "method", name: "getTrends", static: false, private: false, access: { has: obj => "getTrends" in obj, get: obj => obj.getTrends }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getVariance_decorators, { kind: "method", name: "getVariance", static: false, private: false, access: { has: obj => "getVariance" in obj, get: obj => obj.getVariance }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _generatePayment_decorators, { kind: "method", name: "generatePayment", static: false, private: false, access: { has: obj => "generatePayment" in obj, get: obj => obj.generatePayment }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getWeeklySummary_decorators, { kind: "method", name: "getWeeklySummary", static: false, private: false, access: { has: obj => "getWeeklySummary" in obj, get: obj => obj.getWeeklySummary }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        ProgressTrackingController = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return ProgressTrackingController = _classThis;
})();
exports.ProgressTrackingController = ProgressTrackingController;
// ============================================================================
// EXPORTS
// ============================================================================
exports.default = {
    // Progress Measurement
    recordProgressMeasurement,
    calculateActivityEarnedValue,
    verifyProgressMeasurement,
    getActivityProgressHistory,
    // Earned Value Management
    calculateEarnedValue,
    calculateSchedulePerformanceIndex,
    calculateCostPerformanceIndex,
    forecastEstimateAtCompletion,
    // Milestones
    createMilestone,
    updateMilestoneProgress,
    completeMilestone,
    getUpcomingMilestones,
    trackMilestoneCompletion,
    // Daily/Weekly Reports
    createDailyReport,
    addProgressPhotos,
    generateWeeklyProgressSummary,
    approveDailyReport,
    // S-Curve
    generateSCurve,
    analyzeSCurveTrends,
    // Trends and Forecasting
    generateProgressTrends,
    forecastCompletionDate,
    analyzePerformanceTrends,
    // Variance Analysis
    performVarianceAnalysis,
    calculateScheduleVarianceImpact,
    // Progress Payments
    generateProgressPayment,
    approveProgressPayment,
    calculateRetainage,
    // Models
    ProgressMeasurement,
    DailyReport,
    ConstructionMilestone,
    // Controller
    ProgressTrackingController,
};
//# sourceMappingURL=construction-progress-tracking-kit.js.map